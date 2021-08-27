import axios from 'axios';

import {
  getUserReqType,
  getUserResType,
  LoginReqType,
  LoginResType,
  SnsLoginReqType,
  SnsLoginResType,
} from '../types';

const USER_API_URL = 'https://api.marktube.tv/v1/me';
const DATERECORD_API_URL = 'http://localhost:5000/api/login';
const GETUSER_API_URL = 'http://localhost:5000/api/GETUSER';

export default class UserService {
  public static async snsLogin({
    email,
    nickname,
    birthday,
    gender,
    profileImageUrl,
    thumbnailImageUrl,
  }: SnsLoginReqType): Promise<string> {
    const response = await axios.post<SnsLoginResType>(DATERECORD_API_URL, {
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

  public static async getUserByToken(token: String): Promise<getUserResType> {
    const response = await axios.get<getUserResType>(GETUSER_API_URL, {
      params: { token },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data[0];
  }

  public static async login({
    email,
    password,
  }: LoginReqType): Promise<string> {
    const response = await axios.post<LoginResType>(USER_API_URL, {
      email,
      password,
    });
    return response.data.token;
  }

  public static async logout(token: string): Promise<void> {
    await axios.delete(USER_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
