import SessionService = require("./sessionService");
import Logger = require("./logger");
import Api = require("./api");


class ConnectorService {
    private static session: SessionDTO;
    private static sessionPromise: Promise<SessionDTO>;
    private static readonly RequestedLicenses = [];

    public static async connect() {
        if (ConnectorService.sessionPromise)
            return await ConnectorService.sessionPromise;
        ConnectorService.sessionPromise = ConnectorService.connectBase();
        return await ConnectorService.sessionPromise;
    }

    private static async connectBase() {
        try {
            if (!ConnectorService.session) {
                var securityToken = SessionService.getSecurityToken();

                if (securityToken) {
                    Logger.info(ConnectorService, "Updating session");
                    const session = await Api.securityService.connectWithToken(securityToken, ConnectorService.RequestedLicenses);
                    ConnectorService.session = ConnectorService.updateSession(session);
                } else {
                    Logger.info(ConnectorService, "Creating session");
                    let session = await Api.signalsService.connect(SessionService.getClientId(), ConnectorService.RequestedLicenses);
                    session = ConnectorService.validateLicense(session);
                    session = ConnectorService.initializeSession(session);
                    ConnectorService.session = session;
                }

            }
        } catch (error) {
            Logger.handleError(ConnectorService)(error);
        }
        finally {
            ConnectorService.sessionPromise = null;
        }
        return ConnectorService.session;
    }


    private static updateSession(sessionData: SecuritySessionDTO) {
        ConnectorService.validateLicense(sessionData.Session);
        ConnectorService.initializeSession(sessionData.Session);
        SessionService.setSecurityToken(sessionData.SecurityToken);
        SessionService.updateSessionInformation();
        Logger.info(ConnectorService, `Session updated, sessionId: '${SessionService.sessionId}'`);

        return sessionData.Session;
    }

    private static validateLicense(session: SessionDTO) {
        Logger.info(ConnectorService, "Checking license");

        if (!session.IsValidLicense) {
            throw "Invalid license";
        }

        return session;
    }

    private static initializeSession(session: SessionDTO) {
        Logger.info(ConnectorService, `Initializing session, sessionId: ${session.SessionId}`);
        SessionService.sessionId = session.SessionId;
        return session;
    }
}

export = ConnectorService;