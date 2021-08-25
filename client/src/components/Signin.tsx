import React, { useEffect } from 'react';
import { Row, Col, Button, Input, message } from 'antd';

import styles from './Signin.module.css';
import { LoginReqType, SnsLoginReqType } from '../types';

interface SigninProps {
  loading: boolean;
  error: Error | null;
  snsLogin: ({ email }: SnsLoginReqType) => void;
  login: ({ email, password }: LoginReqType) => void;
}

const Signin: React.FC<SigninProps> = ({ loading, error, snsLogin, login }) => {
  const emailRef = React.useRef<Input>(null);
  const passwordRef = React.useRef<Input>(null);

  useEffect(() => {
    if (error === null) return;

    switch (error.message) {
      case 'USER_NOT_EXIST':
        message.error('User not exist');
        break;
      case 'PASSWORD_NOT_MATCH':
        message.error('Wrong password');
        break;
      default:
        message.error('Unknown error occured');
    }
  }, [error]);

  const loginWithKakao = () => {
    window.Kakao.Auth.login({
      scope: 'account_email, profile_image, birthday, gender',
      success: function (response) {
        /*
          access_token: "k4v3JViYJiRNQZmDy5FQxGGft2TsI8Bffn1sZwo9c5sAAAF7cijkeg"
          expires_in: 7199
          refresh_token: "-19Q7SQ9EGxRSkVj61hSaBiBG3AbI5MleAYgoQo9c5sAAAF7cijkeQ"
          refresh_token_expires_in: 5183999
          scope: "profile_nickname"
         */
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res) => {
            const kakao_account = res.kakao_account;
            console.log(kakao_account);
            const {
              email,
              profile: { nickname },
              birthday,
              gender,
            } = kakao_account;
            snsLogin({ email, nickname, birthday, gender });
            /*
              birthday: "0109"
              email: "okwoyjy@gmail.com"
              profile: {nickname: "윤재윤"}
              gender: "male"

              birthday_needs_agreement: false
              birthday_type: "SOLAR"
              email_needs_agreement: false
              gender_needs_agreement: false
              has_birthday: true
              has_email: true
              has_gender: true
              is_email_valid: true
              is_email_verified: true
              profile:
                is_default_image: false
                profile_image_url: "http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_640x640.jpg"
                thumbnail_image_url: "http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_110x110.jpg"
                [[Prototype]]: Object
              profile_image_needs_agreement: false
              profile_nickname_needs_agreement: false
              [[Prototype]]: Object
            */
          },
        });
      },
      fail: function (error) {
        console.log(error);
      },
    });
  };

  const kakaoLogout = () => {
    if (!window.Kakao.Auth.getAccessToken()) {
      alert('Not logged in.');
      return;
    }
    window.Kakao.Auth.logout(function () {
      alert('logout ok\naccess token -> ' + window.Kakao.Auth.getAccessToken());
    });
  };

  function click() {
    const email = emailRef.current?.state.value;
    const password = passwordRef.current?.state.value;

    login({ email, password });
  }

  return (
    <form>
      <Row align="middle" className={styles.signin_row}>
        <Col span={24}>
          <Row className={styles.signin_contents}>
            <Col>
              <div className={styles.signin_title}>데이트 기록</div>
              <div className={styles.signin_subtitle}>데이트 기록과 리스트</div>
              <div className={styles.signin_underline} />

              <div className={styles.button_area}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div id="custom-login-btn" onClick={loginWithKakao}>
                    <img
                      src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
                      width="222"
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
};

export default Signin;
