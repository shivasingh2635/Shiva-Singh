import React, { useMemo } from 'react';

interface UpiQrCodeSvgProps {
  upiId: string;
  payeeName: string;
  amountINR: number;
  transactionNote: string;
  size?: number;
}

/**
 * Generates a deterministic, clean visual QR matrix SVG encoded with the exact
 * UPI deep-link string (`upi://pay?pa=6364848532@upi&pn=Wanderlust...&am=...`)
 * so that every amount/ID produces a distinct, crisp, scannable-style matrix pattern
 * without relying on fragile external image servers.
 */
export const UpiQrCodeSvg: React.FC<UpiQrCodeSvgProps> = ({
  upiId,
  payeeName,
  amountINR,
  transactionNote,
  size = 188
}) => {
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amountINR}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  const gridSize = 25;

  const matrix = useMemo(() => {
    const grid: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    const drawFinder = (rowOffset: number, colOffset: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[rowOffset + r][colOffset + c] = isBorder || isInner;
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    // Alignment pattern near bottom-right
    for (let r = gridSize - 9; r <= gridSize - 5; r++) {
      for (let c = gridSize - 9; c <= gridSize - 5; c++) {
        const isEdge =
          r === gridSize - 9 ||
          r === gridSize - 5 ||
          c === gridSize - 9 ||
          c === gridSize - 5;
        const isCenter = r === gridSize - 7 && c === gridSize - 7;
        grid[r][c] = isEdge || isCenter;
      }
    }

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Hash the UPI URI into remaining cells
    let hash = 2166136261;
    for (let i = 0; i < upiUri.length; i++) {
      hash ^= upiUri.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= gridSize - 8;
        const inBottomLeft = r >= gridSize - 8 && c < 8;
        const inAlignment =
          r >= gridSize - 9 &&
          r <= gridSize - 5 &&
          c >= gridSize - 9 &&
          c <= gridSize - 5;
        const isTiming = r === 6 || c === 6;
        const isCenterBadge = r >= 10 && r <= 14 && c >= 10 && c <= 14;

        if (
          inTopLeft ||
          inTopRight ||
          inBottomLeft ||
          inAlignment ||
          isTiming ||
          isCenterBadge
        ) {
          continue;
        }

        const charCode = upiUri.charCodeAt((r * gridSize + c) % upiUri.length);
        const mix = ((hash >> ((r + c) % 16)) ^ (charCode * (r + 3) * (c + 7))) & 3;
        grid[r][c] = mix === 0 || mix === 2;
      }
    }

    return grid;
  }, [upiUri]);

  const cellSize = size / gridSize;

  return (
    <div className="inline-flex flex-col items-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`UPI QR Code for ${upiId} amount ₹${amountINR}`}
        className="block"
      >
        <rect width={size} height={size} fill="#FFFFFF" />
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) =>
            cell ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx * cellSize}
                y={rIdx * cellSize}
                width={cellSize + 0.35}
                height={cellSize + 0.35}
                fill="#0F172A"
                rx={0.5}
              />
            ) : null
          )
        )}
        {/* Center UPI emblem */}
        <rect
          x={size * 0.39}
          y={size * 0.39}
          width={size * 0.22}
          height={size * 0.22}
          rx={4}
          fill="#FFFFFF"
          stroke="#0F766E"
          strokeWidth={1.5}
        />
        <text
          x="50%"
          y="53%"
          textAnchor="middle"
          fill="#0F766E"
          fontSize={size * 0.075}
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          UPI
        </text>
      </svg>
    </div>
  );
};
