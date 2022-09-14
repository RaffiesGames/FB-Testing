import { assetManager, Component, EditBox, ImageAsset, Sprite, SpriteFrame, Texture2D, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FBScript')
export class FBScript extends Component {

    @property(Sprite) private image: Sprite = null;
    @property(EditBox) private switchID: EditBox = null;

    onLoad() {
        FBInstant.setLoadingProgress(100);
    }

    onEnable() {
        FBInstant.startGameAsync();
    }

    loadImage() {
        let _this = this;

        let profilePictureURL = FBInstant.player.getPhoto();

        assetManager.loadRemote<ImageAsset>(profilePictureURL, { ext: '.jpg' }, function (err, imageAsset) {
            if (err) {
                console.error(err);
            } else {
                let tex2d = new Texture2D();
                let profilePic = new SpriteFrame();
                tex2d.image = imageAsset;
                profilePic.texture = tex2d;
                _this.image.spriteFrame = profilePic;
                return profilePic;
            }
        });

    }

    graph() {
        let _this = this;
        FBInstant.graphApi.requestAsync('/me?fields=id,name,email').then(function (response) {
            console.log(response);
        });
    }

    private tournament: FBInstant.Tournament;
    create() {
        let _this = this;
        FBInstant.tournament.createAsync
            ({
                initialScore: 0,
                config:
                {
                    title: "Test Tournament ",
                    sortOrder: "HIGHER_IS_BETTER",
                    scoreFormat: "NUMERIC",
                },
            }).then(async (tournament: FBInstant.Tournament) => {
                _this.tournament = tournament;
                console.log(_this.tournament.getContextID(), _this.tournament.getEndTime(), _this.tournament.getID(), _this.tournament.getPayload(), _this.tournament.getTitle());
            });
    }

    join() {
        let idToJoin = this.switchID.string;
        console.log("Using ID: ", idToJoin);
        FBInstant.tournament.joinAsync(idToJoin);
    }

    switch() {
        let idToJoin = this.switchID.string;
        console.log("Using ID: ", idToJoin);
        FBInstant.context.switchAsync(idToJoin);
    }
}

