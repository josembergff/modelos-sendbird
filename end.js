const sb = new SendBird({ appId: "9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23" });


sb.connect(`est-18826`, function (user, error) {
    if (error) {
        return;
    }
    console.info("Usuário estabelecimento: ", user);

    ///
    var channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    channelListQuery.includeEmpty = true;
    channelListQuery.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
    channelListQuery.limit = 15;    // The value of pagination limit could be set up to 100.

    if (channelListQuery.hasNext) {
        channelListQuery.next(function (channelList, error) {
            if (error) {
                console.info("Erro Lista canal", error);
                return;
            }

            const nomeHandler = `channelHandlerReceberMensagens_est-18826`;
            sb.removeChannelHandler(nomeHandler);
            const ChannelHandler = new sb.ChannelHandler();

            ChannelHandler.onMessageReceived = function (channel, message) {
                console.info("MENSAGEM recebida", channel, message);
            };
            sb.addChannelHandler(nomeHandler, ChannelHandler);

            // console.info(channelList.length);

            channelList.forEach(f => {
                console.info(f.name, f.channelType, f.unreadMessageCount, f.memberCount, new Date(f.createdAt), f.members)
                sb.GroupChannel.getChannel(f.url, function(groupChannel, error) {
                    if (error) {
                        return;
                    }
                    // console.info(groupChannel);
                    // groupChannel.hide(true, true, function(response, error) {
                    //     if (error) {
                    //         return;
                    //     }
                    // });
                });
            });
        });
    }
    ///


    

});