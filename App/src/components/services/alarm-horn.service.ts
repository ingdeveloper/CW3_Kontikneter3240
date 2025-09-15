import Logger = require("../../services/logger");

declare var window;

class AlarmHornService implements IAlarmHornParams {
    public readonly loop: boolean;
    public readonly soundFilePath: string;
    public readonly playSound: boolean;
    private audioElement: HTMLAudioElement;

    constructor(settings?: IAlarmHornParams) {
        this.soundFilePath = settings.soundFilePath || "_SERVICES/HornAlarm.mp3";
        this.loop = settings.loop || false;
        this.playSound = settings.playSound || false;
        this.createAudio();
    }

    private createAudio() {
        if (!this.playSound)
            return;

        if (!this.audioElement) {
            this.audioElement = new Audio(`${this.getPath()}/${this.soundFilePath}`);
            this.audioElement.loop = this.loop;
        }
    }

    public async play() {
        if (!this.playSound)
            return;

        this.createAudio();

        Logger.info(AlarmHornService, `play sound ${this.getPath()}/${this.soundFilePath}`);

        try {
            await this.audioElement.play()
        } catch (error) {
            Logger.error(AlarmHornService, "Unable to play sound.\n" + error, error);
        }
    }

    public get isPlaying() {
        if (!this.playSound)
            return false;
        return !this.audioElement.paused;
    }

    public stop() {
        if (!this.playSound)
            return;
        Logger.info(AlarmHornService, `stop sound ${this.getPath()}/${this.soundFilePath}`);
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }

    private getPath() {
        return `${window.rootUrlPrefix}`;
    }

}

export = AlarmHornService;