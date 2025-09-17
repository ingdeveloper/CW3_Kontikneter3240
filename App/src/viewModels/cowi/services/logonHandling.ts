import signalsConnector = require("../../../services/connector");
import CryptoJS = require("./CryptoJS");

class LogonHandling {
  /** WF-Connector */
  protected static connector: signalsConnector = new signalsConnector();

  private static Decrypt(encryptedText: string): string {
    let key = CryptoJS.enc.Utf8.parse("CYMR9Fzu45P3H9k7");
    let encryptedData = CryptoJS.enc.Base64.parse(encryptedText);

    // Der IV ist die ersten 16 Bytes des verschlüsselten Textes
    let iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));

    // Der eigentliche verschlüsselte Text beginnt nach den ersten 16 Bytes
    let ciphertext = CryptoJS.lib.WordArray.create(
      encryptedData.words.slice(4)
    );

    let decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
      iv: iv,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  public login(ub: string) {
    try {
      const parsedParameter = JSON.parse(
        LogonHandling.Decrypt(ub).replace(/'/g, '"')
      );
      LogonHandling.connector.login(
        parsedParameter.user,
        parsedParameter.pass,
        false
      );
    } catch (error) {
      console.error("Fehler beim Userlogin", error);
    }
  }
}

export const userLogHandle = new LogonHandling();
