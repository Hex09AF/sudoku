export enum SocketEvent {
  CLIENT_PLAY = "GAME:PLAY_A_MOVE",
  SERVER_CLIENT_PLAY = "SERVER:GAME:PLAY_A_MOVE",

  CLIENT_CONNECTED = "CLIENT:CONNECTED",
  SERVER_CLIENT_CONNECTED = "SERVER:CLIENT:CONNECTED",

  CLIENT_JOIN_ROOM = "CLIENT:GAME:JOIN_ROOM",
  SERVER_ADD_CLIENT = "SERVER:GAME:ADD_CLIENT",

  CLIENT_UPDATE_CLIENT = "CLIENT:GAME:UPDATE_CLIENT",
  SERVER_UPDATE_CLIENT = "SERVER:GAME:UPDATE_CLIENT",

  CLIENT_UPDATE_CLIENT_STATUS = "CLIENT:GAME:UPDATE_CLIENT_STATUS",
  SERVER_UPDATE_CLIENT_STATUS = "SERVER:GAME:UPDATE_CLIENT_STATUS",

  SERVER_REMOVE_CLIENT = "SERVER:GAME:REMOVE_CLIENT",
}

export interface UserInfo {
  userId: string;
  moves: number[][];
  score: number;
  plus: number;
  status: string;
}

export interface UserInfoStatus {
  userId: string;
  status: string;
}

export interface UserInRoom {
  id: string;
  userId: string;
  roomId: string;
  score: number;
  moves: number[][];
  plus?: number;
  status: string;
}
