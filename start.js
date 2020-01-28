const sb = new SendBird({ appId: "9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23" });


    sb.connect(`user-144`, function (user, error) {
        if (error) {
            return;
        }
        console.info("Usuário cliente: ", user);
        sb.updateCurrentUserInfo("Alex Ionic", "https://kaddeqas.blob.core.windows.net/imagemusuarios/144_thumbnail.jpg?t=637158067723869529");
        let userIdsGroup = ['user-144', 'est-18826'];
        let NAME = "user-144-est-18826";
        sb.GroupChannel.createChannelWithUserIds(userIdsGroup, true, NAME, null, null, function (groupChannel, error) {
            if (error) {
                console.log("Erro usuários cliente: ", error);
                return;
            }

            console.info("Grupos cliente: ", groupChannel);
            
            var userIds = ['user-144', 'est-18826'];

            groupChannel.inviteWithUserIds(userIds, function(response, error) {
                if (error) {
                    return;
                }
            });
            
            ////
            const params = new sb.UserMessageParams();

            params.message = "Olá";
            //params.customType = "";
            params.data = JSON.stringify({ usuarios:{ "user-144":{
                    Id: 144,
                    Nome: "Alex",
                    Email: "alex@gmail.com",
                    UrlImagemUsuario: "https://kaddeqas.blob.core.windows.net/imagemusuarios/144_thumbnail.jpg?t=637158067723869529"
                } 
            }});
            params.mentionType = 'users';                       // Either 'users' or 'channel'
            params.mentionedUserIds = ['est-18826'];        // Or mentionedUsers = Array<User>; 
            //params.metaArrayKeys = ['linkTo', 'itemType'];
            //params.translationTargetLanguages = ['fe', 'de'];   // French and German
            params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress' 

            groupChannel.sendUserMessage(params, function(message, error) {
                if (error) {
                    console.info("Erro Mensagem enviada", error);
                    return;
                }

                console.info("Mensagem enviada", message);
            });


        });
    });