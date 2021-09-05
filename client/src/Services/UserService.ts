import axios from 'axios';
import { axiosInst } from '../axiosConfig';

import {
  getUserByEmailReqType,
  getUserResType,
  LoginReqType,
  LoginResType,
  reqAcceptCoupleType,
  SnsLoginReqType,
  SnsLoginResType,
} from '../types';

const USER_API_URL = 'https://api.marktube.tv/v1/me';
const DATERECORD_API_URL = 'http://localhost:5000/api/login';
const GETUSER_API_URL = 'http://localhost:5000/api/getUser';
const REQCOUPLE_API_URL = 'http://localhost:5000/api/couple/request';
const ACCEPTCOUPLE_API_URL = 'http://localhost:5000/api/couple/accept';

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
    const response = await axios.get<getUserResType[]>(GETUSER_API_URL, {
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
    const response = await axios.get<getUserResType[]>(
      `${GETUSER_API_URL}/email`,
      {
        params: { email: searchOption.email },
        headers: {
          Authorization: `Bearer ${searchOption.token}`,
        },
      },
    );
    return response.data;
  }

  public static async requestCouple({
    reqestUserId,
    receiveUserId,
    token,
  }): Promise<getUserResType[]> {
    const response = await axios.get<getUserResType[]>(`${REQCOUPLE_API_URL}`, {
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
    const response = await axios.get<getUserResType[]>(
      `${ACCEPTCOUPLE_API_URL}`,
      {
        params: {
          coupleId: reqAcceptCouple.coupleId,
          status: reqAcceptCouple.status,
        },
        headers: {
          Authorization: `Bearer ${reqAcceptCouple.token}`,
        },
      },
    );
    return response.data;
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
