// Text the tests assert on, copied verbatim with its source path, so a copy change is fixed here, not in specs.
//   UI text: ../client/src/lib/strings.ts (the game has one locale, Vietnamese, and no server messages)

export const copy = {
  // strings.ts → appName
  appName: "Duck Mines",
  // strings.ts → boardLabel(name, cols, rows, mines)
  boardLabel: (name: string, cols: number, rows: number, mines: number) => `${name}: ${cols}×${rows}, ${mines} mìn`,
  difficulty: {
    // strings.ts → difficultyBeginner / Intermediate / Expert / Custom
    beginner: "Dễ",
    intermediate: "Trung bình",
    expert: "Khó",
    custom: "Tuỳ chỉnh",
  },
  // strings.ts → difficultySpec(cols, rows, mines)
  difficultySpec: (cols: number, rows: number, mines: number) => `${cols}×${rows} · ${mines} mìn`,
  // strings.ts → customUnranked (appended to the board label as " · không tính kỷ lục")
  customUnranked: "không tính kỷ lục",
  hud: {
    // strings.ts → newGame, minesRemaining, elapsed
    newGame: "Bàn mới",
    minesRemaining: "Số mìn còn lại",
    elapsed: "Thời gian đã chơi",
  },
  header: {
    // strings.ts → theme, settings
    theme: "Đổi sáng / tối",
    settings: "Cài đặt",
  },
  board: {
    // strings.ts → boardGrid
    grid: "Bàn dò mìn",
  },
  // strings.ts → cellHidden / cellFlagged / cellUnsure / cellEmpty / cellNumber / cellMine / cellExploded / cellWrongFlag
  // (row and col are 1-based in the label)
  cell: {
    hidden: (r: number, c: number) => `hàng ${r}, cột ${c}, chưa mở`,
    flagged: (r: number, c: number) => `hàng ${r}, cột ${c}, đã cắm cờ`,
    unsure: (r: number, c: number) => `hàng ${r}, cột ${c}, đánh dấu chưa chắc`,
    empty: (r: number, c: number) => `hàng ${r}, cột ${c}, trống`,
    number: (r: number, c: number, n: number) => `hàng ${r}, cột ${c}, ${n} mìn xung quanh`,
    mine: (r: number, c: number) => `hàng ${r}, cột ${c}, mìn`,
    exploded: (r: number, c: number) => `hàng ${r}, cột ${c}, mìn đã nổ`,
    wrongFlag: (r: number, c: number) => `hàng ${r}, cột ${c}, cờ cắm sai`,
  },
  result: {
    // strings.ts → wonTitle, wonRecord, lostTitle, lostHint, close
    wonTitle: "Dọn sạch bàn",
    wonRecord: "Nhanh nhất từ trước tới giờ",
    lostTitle: "Nổ rồi",
    lostHint: "Cờ bị gạch chéo là chỗ cắm sai.",
    close: "Đóng",
  },
  settings: {
    // strings.ts → settingsTitle, close, section*, abandon*, custom*, unsure*, sound*, theme*, noRecord, clearRecords,
    // recordsStorageOff, playRulesNote
    title: "Cài đặt",
    close: "Đóng",
    sectionDifficulty: "Độ khó",
    sectionTheme: "Giao diện",
    abandonQuestion: (name: string) => `Bỏ bàn đang chơi để sang mức ${name}?`,
    abandonConfirm: "Bỏ bàn",
    abandonCancel: "Giữ lại",
    customCols: "Cột",
    customRows: "Hàng",
    customMines: "Mìn",
    customDensity: (percent: number) => `Mật độ mìn ${percent}% (mức Khó là 21%)`,
    customMaxMines: (max: number) => `Nhiều nhất ${max} mìn: nước đầu luôn chừa trống ô đã bấm và 8 ô quanh nó.`,
    customNotRanked: "Bàn tự đặt không ghi kỷ lục. Ba mức có sẵn vẫn giữ bảng riêng.",
    unsureLabel: "Dấu hỏi trong chu kỳ cờ",
    soundLabel: "Tiếng khi mìn nổ",
    themeSystem: "Theo hệ",
    themeLight: "Sáng",
    themeDark: "Tối",
    noRecord: "—",
    clearRecords: "Xoá kỷ lục",
    recordsStorageOff: "Máy này không cho lưu, nên kỷ lục sẽ mất khi đóng tab.",
    playRulesNote:
      "Bàn sinh theo luật gốc Minesweeper. Không đảm bảo lúc nào cũng suy ra được — nước cuối có thể phải đoán.",
  },
  touch: {
    // strings.ts → modeDig, modeFlag, modeSwitch, rotateHint
    modeDig: "Mở",
    modeFlag: "Cờ",
    modeSwitch: "Chọn kiểu chạm",
    rotateHint: "Xoay ngang để thấy cả bàn.",
  },
  hints: {
    // strings.ts → hintKeys, hintRightClick, hintChord
    keys: "Bàn phím: mũi tên di chuyển, Space mở, F cắm cờ, R bàn mới",
    rightClick: "Chuột phải cắm cờ",
    chord: "Bấm thẳng lên ô số đã đủ cờ để mở quanh, hoặc chuột giữa",
  },
  account: {
    // strings.ts → account.*
    signIn: "Đăng nhập",
    menuLabel: "Tài khoản Ducker ID",
    openProfile: "Mở hồ sơ Ducker ID",
    signOut: "Đăng xuất",
  },
} as const;
