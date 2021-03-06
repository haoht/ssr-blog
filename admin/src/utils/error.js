/**
 * Created by unsad on 2017/10/15.
 */
export const getChineseDesc = desc => {
  switch (desc) {
    case 'Token not found':
      return '请求失败，请确认您已登录';
    case 'Get token failed.Check the password':
      return '登录失败，请检查您的密码';
    case 'Get token failed.Check the name':
      return '登录失败，请检查您的账号';
    case 'Token verify failed':
    case 'Token invalid':
      return 'Token验证失败，请重新登录';
    default:
      return desc;
  }
};
