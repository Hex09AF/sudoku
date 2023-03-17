export enum SUDOKU_GUARD {
  validateFill = "validateFill",
  verifyGameEnd = "verifyGameEnd",
}

export enum SUDOKU_STATE {
  playing = "@/playing",
  ending = "@/ending",
  playingTakingTurn = "@/playing/takingTurn",
  playingCheckingGameState = "@/playing/checkingGameState",
}

export enum SUDOKU_CALLBACK {
  updateGameMovesToDB = "updateGameMovesToDB",
}

export enum SUDOKU_ACTION {
  executeTryGameEnd = "executeTryGameEnd",
  executeUpdateCanArray = "executeUpdateCanArray",
  executeFill = "executeFill",
  executeMove = "executeMove",
  executeBulkUsers = "executeBulkUsers",
  executeUpdateUserStatus = "executeUpdateUserStatus",
  executeUpdateUserOnlineStatus = "executeUpdateUserOnlineStatus",
  executeAnimateCell = "executeAnimateCell",
}

export enum SUDOKU_EVENT {
  fill = "fill",
  move = "move",
  bulkUsers = "bulkUsers",
  updateUserStatus = "updateUserStatus",
  updateUserOnlineStatus = "updateUserOnlineStatus",
}
