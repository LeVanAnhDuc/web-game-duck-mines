/**
 * Every string the player can see, in one flat object - NFR-I18N-01. Not an i18n
 * framework: there is one locale, and a framework can be added later without
 * touching a single component.
 */
export const strings = {
  appName: "Minesweeper",
  appDescription:
    "Minesweeper đúng luật bản gốc, chơi được bằng ngón tay trên điện thoại.",

  boardLabel: (cols: number, rows: number, mines: number) =>
    `Dễ: ${cols}×${rows}, ${mines} mìn`,

  minesRemaining: "Số mìn còn lại",
  elapsed: "Thời gian đã chơi",
  newGame: "Bàn mới",
  theme: "Đổi sáng / tối",
  settings: "Cài đặt",

  boardGrid: "Bàn dò mìn",
  cellHidden: (row: number, col: number) => `hàng ${row}, cột ${col}, chưa mở`,
  cellFlagged: (row: number, col: number) => `hàng ${row}, cột ${col}, đã cắm cờ`,
  cellUnsure: (row: number, col: number) => `hàng ${row}, cột ${col}, đánh dấu chưa chắc`,
  cellEmpty: (row: number, col: number) => `hàng ${row}, cột ${col}, trống`,
  cellNumber: (row: number, col: number, n: number) =>
    `hàng ${row}, cột ${col}, ${n} mìn xung quanh`,
  cellMine: (row: number, col: number) => `hàng ${row}, cột ${col}, mìn`,
  cellExploded: (row: number, col: number) => `hàng ${row}, cột ${col}, mìn đã nổ`,
  cellWrongFlag: (row: number, col: number) => `hàng ${row}, cột ${col}, cờ cắm sai`,

  wonTitle: "Dọn sạch bàn",
  lostTitle: "Nổ rồi",
  lostHint: "Cờ bị gạch chéo là chỗ cắm sai.",

  hintRightClick: "Chuột phải cắm cờ",
  hintMiddleClick: "Chuột giữa mở quanh",
  hintKeys: "Mũi tên di chuyển, Space mở, F cắm cờ, R bàn mới",
} as const;
