/**
 * Every string the player can see, in one flat object - NFR-I18N-01. Not an i18n
 * framework: there is one locale, and a framework can be added later without
 * touching a single component.
 */
export const strings = {
  appName: "Minesweeper",
  appDescription:
    "Minesweeper đúng luật bản gốc, chơi được bằng ngón tay trên điện thoại.",

  boardLabel: (name: string, cols: number, rows: number, mines: number) =>
    `${name}: ${cols}×${rows}, ${mines} mìn`,

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
  wonRecord: "Nhanh nhất từ trước tới giờ",
  lostTitle: "Nổ rồi",
  lostHint: "Cờ bị gạch chéo là chỗ cắm sai.",

  settingsTitle: "Cài đặt",
  close: "Đóng",

  sectionDifficulty: "Độ khó",
  sectionPlay: "Lối chơi",
  sectionSound: "Âm thanh",
  sectionTheme: "Giao diện",
  sectionRecords: "Kỷ lục",

  difficultyBeginner: "Dễ",
  difficultyIntermediate: "Trung bình",
  difficultyExpert: "Khó",
  difficultySpec: (cols: number, rows: number, mines: number) =>
    `${cols}×${rows} · ${mines} mìn`,

  abandonQuestion: (name: string) => `Bỏ bàn đang chơi để sang mức ${name}?`,
  abandonConfirm: "Bỏ bàn",
  abandonCancel: "Giữ lại",

  unsureLabel: "Dấu hỏi ❓ trong chu kỳ cờ",
  unsureHelp: "Chạm lần nữa sau lá cờ để đánh dấu ô chưa chắc.",

  soundLabel: "Tiếng khi mìn nổ",
  soundHelp: "Mặc định tắt. Không có âm nào khác — mở ô và cắm cờ luôn im lặng.",

  themeSystem: "Theo hệ",
  themeLight: "Sáng",
  themeDark: "Tối",

  noRecord: "—",
  clearRecords: "Xoá kỷ lục",
  recordsStorageOff: "Máy này không cho lưu, nên kỷ lục sẽ mất khi đóng tab.",

  hintRightClick: "Chuột phải cắm cờ",
  hintMiddleClick: "Chuột giữa mở quanh",
  hintKeys: "Mũi tên di chuyển, Space mở, F cắm cờ, R bàn mới",
} as const;
