const sb = new SendBird({ appId: "9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23" });

var _groupChannel;
    sb.connect(`user-144`, function (user, error) {
        if (error) {
            return;
        }
        aguardarMensagens();
        sb.updateCurrentUserInfo("Alex Ionic", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EccM8blle2lfzwlPidvvAp2gqfOpDfvaq76sUSyqlDdP1hgcAg&s");
        let userIdsGroup = ['user-144', 'est-18826'];
        let NAME = "user-144-est-18826";

        sb.GroupChannel.createChannelWithUserIds(userIdsGroup, true, NAME, null, null, function (groupChannel, error) {
            if (error) {
                console.error("Erro usuários cliente: ", error);
                return;
            }

            _groupChannel = groupChannel;
            
            carregarMensagens();
            

        });
    });

    const aguardarMensagens = () => {
        const nomeHandler = `channelHandlerReceberMensagensGrupo_teste1`;
        sb.removeChannelHandler(nomeHandler);
        const ChannelHandler = new sb.ChannelHandler();
    
        ChannelHandler.onMessageReceived = function (channel, message) {
            adicionarMensagem(false, message);
        };
    
        sb.addChannelHandler(nomeHandler, ChannelHandler);
    };

    const adicionarMensagem = (usuarioAtual, message) => {
        const novaLinhaMensagem = `${usuarioAtual ? "Usuário atual":"Outro usuário"} | Data: ${moment(new Date(message.createdAt)).format("lll")} | Nick:${message._sender.nickname} | ${message.message} <br><br>`;
        $("#divMensagens").prepend(novaLinhaMensagem);
    }

    const campoEnvioMensagemkeydown = (function (e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            console.log(e.srcElement.value, this);
            enviarMensagemCliente(e.srcElement.value);
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

    const enviarMensagemCliente = (mensagem) => {
        const params = new sb.UserMessageParams();

        params.message = mensagem;
        //params.customType = "";
        params.data = JSON.stringify({ usuarios:{ "user-144":{
                Id: 144,
                Nome: "Alex",
                Email: "alex@gmail.com",
                UrlImagemUsuario: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EccM8blle2lfzwlPidvvAp2gqfOpDfvaq76sUSyqlDdP1hgcAg&s"
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

    