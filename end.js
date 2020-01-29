
const sb = new SendBird({ appId: "9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23" });

var _groupChannel;
sb.connect(`est-18826`, function (user, error) {
    if (error) {
        return;
    }
    sb.updateCurrentUserInfo("Estabelecimento", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBO6Pxqa7Iv1zMKctTWsOHjNYdA7EMvP7W1Ll8fBlZc7tp5I-N&s");
    aguardarMensagens();
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
                    _groupChannel = groupChannel;
                    carregarMensagens();
                });
            });
        });
    }
    ///


    

});

const aguardarMensagens = () => {
    const nomeHandler = `channelHandlerReceberMensagensGrupo_teste2`;
    sb.removeChannelHandler(nomeHandler);
    const ChannelHandler = new sb.ChannelHandler();

    ChannelHandler.onMessageReceived = function (channel, message) {
        adicionarMensagem(false, message);
    };

    sb.addChannelHandler(nomeHandler, ChannelHandler);
};

const adicionarMensagem = (usuarioAtual, message) => {
    const novaLinhaMensagem = `${usuarioAtual ? "Usuário atual":"Outro usuário"} 
    | Data: ${moment(new Date(message.createdAt)).format("lll")} 
    | Nick:${message._sender ? message._sender.nickname : "sem nick"} 
    | ${message.message} <br><br>`;
    $("#divMensagens").prepend(novaLinhaMensagem);
}

const campoEnvioMensagemkeydown = (function (e) {
    if (e.keyCode === 13 && !e.shiftKey) {
        console.log(e.srcElement.value, this);
        enviarMensagemEstabelecimento(e.srcElement.value);
        e.srcElement.value = "";
    }
});

const carregarMensagens = () => {
    var prevMessageListQuery = _groupChannel.createPreviousMessageListQuery();
    prevMessageListQuery.limit = 100;
    prevMessageListQuery.reverse = false;

    prevMessageListQuery.load(function (messages, error) {
        if (error) {
            return;
        }

        messages.forEach(f => {
            adicionarMensagem(false, f);
        });

        _groupChannel.markAsRead();
    });
};

const enviarMensagemEstabelecimento = (mensagem) => {
    const params = new sb.UserMessageParams();

    params.message = mensagem;
    //params.customType = "";
    params.data = JSON.stringify({ usuarios:{ "est-18826":{
            Id: 144,
            Nome: "Estabelecimento",
            Email: "estabelecimento@gmail.com",
            UrlImagemUsuario: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBO6Pxqa7Iv1zMKctTWsOHjNYdA7EMvP7W1Ll8fBlZc7tp5I-N&s"
        } 
    }});
    params.mentionType = 'users';                       // Either 'users' or 'channel'
    params.mentionedUserIds = ['est-18826'];        // Or mentionedUsers = Array<User>; 
    //params.metaArrayKeys = ['linkTo', 'itemType'];
    //params.translationTargetLanguages = ['fe', 'de'];   // French and German
    params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress' 

    _groupChannel.sendUserMessage(params, function(message, error) {
        if (error) {
            console.info("Erro Mensagem enviada", error);
            return;
        }
        adicionarMensagem(true, message);
    });

}