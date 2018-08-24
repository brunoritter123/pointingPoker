export class FbResponse {
  public status: string; // especifica o status de login da pessoa que está usando o aplicativo
  // connected - a pessoa está conectada ao Facebook e conectou-se ao seu aplicativo.
  // not_authorized - a pessoa está conectada ao Facebook, mas não se conectou ao seu aplicativo..
  // unknown - a pessoa não está conectada ao Facebook, então não é possível saber se ela se conectou ao seu aplicativo ou se

  public authResponse: AuthResponse; // será incluído se o status for connected
}

class AuthResponse {
  public accessToken: string; // contém um token de acesso para a pessoa que está usando o aplicativo.
  public expiresIn: string; // Indica o tempo de UNIX quando o token expira e precisa ser renovado.
  public signedRequest: string; // um parâmetro assinado, contendo informações sobre a pessoa que está utilizando o aplicativo.
  public userID: string; // é o ID da pessoa que está usando o aplicativo.
}
