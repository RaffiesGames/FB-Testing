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

    // 5991573460905711
    // 4532531090136885
    // 4055975607846473 

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
        // let _this = this;
        // FBInstant.graphApi.requestAsync('/me?fields=id,name,email').then(function (response) {
        //     console.log(response);
        // });
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
        FBInstant.context.switchAsync(idToJoin, true);
    }

    connectPlayers() {
        var connectedPlayers = FBInstant.player.getConnectedPlayersAsync()
            .then(function (players) {
                console.log('players: ', players);
                console.log(players.map(function (player) {
                    return {
                        id: player.getID(),
                        name: player.getName(),
                    }
                }));
            });
    }

    leaderboardCheck() {
        let idToJoin = this.switchID.string;
        console.log('FBInstant.context.getID(): ', FBInstant.context.getID());
        FBInstant.getLeaderboardAsync('Test.' + idToJoin)
            .then(function (leaderboard) {
                console.log('Leaderboard: ', leaderboard);
                // return leaderboard.getConnectedPlayerEntriesAsync();
            })
    }

    sendLeaderboardScore() {
        let idToJoin = this.switchID.string;
        FBInstant.getLeaderboardAsync('Test.' + idToJoin)
            .then(function (leaderboard) {
                leaderboard.setScoreAsync(18, '{extra: "data"}');
                // return leaderboard.getConnectedPlayerEntriesAsync();
            }).then(() => console.log('Score saved'))
            .catch(error => console.error(error));
    }

    retrieveLeaderboardScore() {
        let idToJoin = this.switchID.string;
        FBInstant
            .getLeaderboardAsync('Test.' + idToJoin)
            .then(leaderboard => leaderboard.getEntriesAsync(10, 0))
            .then(entries => {
                for (var i = 0; i < entries.length; i++) {
                    console.log(
                        entries[i].getRank() + '. ' +
                        entries[i].getPlayer().getName() + ': ' +
                        entries[i].getScore()
                    );
                }
            }).catch(error => console.error(error));

    }

    postLeaderboardScore() {
        let idToJoin = this.switchID.string;
        FBInstant.updateAsync({
            action: 'LEADERBOARD',
            name: 'Test.' + idToJoin
        })
            .then(() => console.log('Update Posted'))
            .catch(error => console.error(error));

    }

    switchToContext() {
        let idToJoin = this.switchID.string;
        FBInstant.context
            .switchAsync(idToJoin, true)
            .then(function () {
                console.log(FBInstant.context.getID());
            });

    }

    createAsync() {
        let idToJoin = this.switchID.string;
        FBInstant.context
            .createAsync(idToJoin)
            .then(function () {
                console.log(FBInstant.context.getID());
            })
    }

    emptyCreateAsync() {
        FBInstant.context
            .createAsync()
            .then(function () {
                console.log(FBInstant.context.getID());
            })
    }

    switchEmpty() {
        FBInstant.context
            .switchAsync("SOLO", true)
            .then(function () {
                console.log(FBInstant.context.getID());
            });
    }
}

