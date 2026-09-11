/**
 * Every string the player can see, in one flat object - NFR-I18N-01. Not an i18n
 * framework: there is one locale, and a framework can be added later without
 * touching a single component.
 */
export const strings = {
  appName: "Duck Mines",
  appDescription:
    "Dò mìn đúng luật bản gốc Minesweeper, chơi được bằng ngón tay trên điện thoại.",

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
  difficultyCustom: "Tuỳ chỉnh",
  customUnranked: "không tính kỷ lục",
  difficultySpec: (cols: number, rows: number, mines: number) =>
    `${cols}×${rows} · ${mines} mìn`,

  abandonQuestion: (name: string) => `Bỏ bàn đang chơi để sang mức ${name}?`,
  customCols: "Cột",
  customRows: "Hàng",
  customMines: "Mìn",
  customDensity: (percent: number) => `Mật độ mìn ${percent}% (mức Khó là 21%)`,
  customMaxMines: (max: number) =>
    `Nhiều nhất ${max} mìn: nước đầu luôn chừa trống ô đã bấm và 8 ô quanh nó.`,
  customNotRanked: "Bàn tự đặt không ghi kỷ lục. Ba mức có sẵn vẫn giữ bảng riêng.",
  abandonConfirm: "Bỏ bàn",
  abandonCancel: "Giữ lại",

  unsureLabel: "Dấu hỏi trong chu kỳ cờ",
  unsureHelp: "Chạm lần nữa sau lá cờ để đánh dấu ô chưa chắc bằng dấu hỏi.",

  soundLabel: "Tiếng khi mìn nổ",
  soundHelp: "Mặc định tắt. Không có âm nào khác — mở ô và cắm cờ luôn im lặng.",

  themeSystem: "Theo hệ",
  themeLight: "Sáng",
  themeDark: "Tối",

  noRecord: "—",
  clearRecords: "Xoá kỷ lục",
  recordsStorageOff: "Máy này không cho lưu, nên kỷ lục sẽ mất khi đóng tab.",

  modeDig: "Mở",
  modeFlag: "Cờ",
  modeSwitch: "Chọn kiểu chạm",
  rotateHint: "Xoay ngang để thấy cả bàn.",

  // Keyboard first, on purpose. It used to be last, behind two clauses opening with
  // the word "Chuột", and a player who cannot hold a mouse read the first five
  // seconds as a door closing: "nam giay dau toi da kip nghi 'lai mot trang nua
  // khong danh cho minh'" (p03-RR-06).
  // The product already states a Non-Goal in place twice - under the sound switch,
  // and in red above the custom board. This is the third and biggest one, and it was
  // the one left unsaid: a "no-guess" player hunted for it in the first ten seconds,
  // did not find it, and only learned the truth by losing a board five minutes later.
  playRulesNote:
    "Bàn sinh theo luật gốc Minesweeper. Không đảm bảo lúc nào cũng suy ra được — nước cuối có thể phải đoán.",

  madeBy: "Dự án học tập của LeVanAnhDuc",
  sourceCode: "Mã nguồn",
  sourceUrl: "https://github.com/LeVanAnhDuc/web-game-duck-mines",

  hintKeys: "Bàn phím: mũi tên di chuyển, Space mở, F cắm cờ, R bàn mới",
  hintRightClick: "Chuột phải cắm cờ",
  // Chord has two ways in and the UI only ever named the one a trackpad does not
  // have: "Toi khong co chuot giua... Vay la co mot chuc nang o day toi vinh vien
  // khong dung duoc a?" (p04-RR-05). Clicking the number itself always worked.
  hintChord: "Bấm thẳng lên ô số đã đủ cờ để mở quanh, hoặc chuột giữa",
} as const;
