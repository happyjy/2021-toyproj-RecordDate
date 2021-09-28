import { axiosInst } from '../axiosConfig';

import {
  getUserByEmailReqType,
  getUserResType,
  reqAcceptCoupleType,
  SnsLoginReqType,
  SnsLoginResType,
} from '../types';

// const USER_API_URL = 'https://api.marktube.tv/v1/me';
// const DATERECORD_API_URL = 'http://localhost:5000/api/login';
// const GETUSER_API_URL = 'http://localhost:5000/api/getUser';
// const REQCOUPLE_API_URL = 'http://localhost:5000/api/couple/request';
// const ACCEPTCOUPLE_API_URL = 'http://localhost:5000/api/couple/accept';

export default class UserService {
  public static async snsLogin({
    email,
    nickname,
    birthday,
    gender,
    profileImageUrl,
    thumbnailImageUrl,
  }: SnsLoginReqType): Promise<string> {
    const response = await axiosInst.post<SnsLoginResType>('/login', {
      param: {
        email,
        nickname,
        birthday,
        gender,
        profileImageUrl,
        thumbnailImageUrl,
      },
    });
    return response.data.token;
  }

  public static async getUserByToken(token: String): Promise<getUserResType[]> {
    const response = await axiosInst.get<getUserResType[]>('/getUser', {
      params: { token },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  public static async getUserByEmail(
    searchOption: getUserByEmailReqType,
  ): Promise<getUserResType[]> {
    const response = await axiosInst.get<getUserResType[]>(`/getUser/email`, {
      params: { email: searchOption.email },
      headers: {
        Authorization: `Bearer ${searchOption.token}`,
      },
    });
    return response.data;
  }

  public static async requestCouple({
    reqestUserId,
    receiveUserId,
    token,
  }): Promise<getUserResType[]> {
    const response = await axiosInst.get<getUserResType[]>(`/couple/request`, {
      params: {
        reqestUserId,
        receiveUserId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  public static async acceptCouple(
    reqAcceptCouple: reqAcceptCoupleType,
  ): Promise<getUserResType[]> {
    const response = await axiosInst.get<getUserResType[]>(`/couple/accept`, {
      params: {
        coupleId: reqAcceptCouple.coupleId,
        status: reqAcceptCouple.status,
      },
      headers: {
        Authorization: `Bearer ${reqAcceptCouple.token}`,
      },
    });
    return response.data;
  }

  // [todo]
  public static async logout(token: string): Promise<void> {
    await axiosInst.delete('logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // public static async login({
  //   email,
  //   password,
  // }: LoginReqType): Promise<string> {
  //   const response = await axiosInst.post<LoginResType>(USER_API_URL, {
  //     email,
  //     password,
  //   });
  //   return response.data.token;
  // }
}
