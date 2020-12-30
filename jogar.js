function trocarArena01() {
  document.getElementById("imgArena").src = "imagens/InGame/arenaAzul.png";
}

function trocarArena02() {
  document.getElementById("imgArena").src = "imagens/InGame/arenaVerde.png";
}

function trocarArena03() {
  document.getElementById("imgArena").src = "imagens/InGame/arenaQueimando.png";
}

function trocarArena04() {
  document.getElementById("imgArena").src = "imagens/InGame/arenaPadrao.png";
}

////// LIMPA O LOCAL STORAGE

/*$(window).bind("beforeunload", function() {
  window.location.href = "jogar-1.html";
  
  return (window.location.href = "jogar.html");
  //localStorage.clear();
});*/

////// VARIÁVEL QUE CONTROLA O NÚMERO DE CLICKS NO BOTÃO JOGAR

$(document).ready(function() {
  ///// CRIA O ARRAY DE CARTAS DA MÃO NO LOCAL STORAGE

  let criaObjsLocalStorage = function() {
    if (JSON.parse(localStorage.getItem("cartasMaoP1")) === null) {
      localStorage.setItem("cartasMaoP1", JSON.stringify([]));
    }

    ///

    if (JSON.parse(localStorage.getItem("cartasMaoP2")) === null) {
      localStorage.setItem("cartasMaoP2", JSON.stringify([]));
    }

    ///

    if (JSON.parse(localStorage.getItem("cartasArenaP1")) === null) {
      localStorage.setItem("cartasArenaP1", JSON.stringify([]));
    }

    ///

    if (JSON.parse(localStorage.getItem("cartasArenaP2")) === null) {
      localStorage.setItem("cartasArenaP2", JSON.stringify([]));
    }

    ///

    if (JSON.parse(localStorage.getItem("hpP1")) === null) {
      localStorage.setItem("hpP1", JSON.stringify({ hp: 50 }));
    }

    ///

    if (JSON.parse(localStorage.getItem("hpP2")) === null) {
      localStorage.setItem("hpP2", JSON.stringify({ hp: 50 }));
    }

    ///

    if (JSON.parse(localStorage.getItem("cartasp1")) === null) {
      localStorage.setItem("cartasp1", JSON.stringify([]));
    }
    /////

    if (JSON.parse(localStorage.getItem("cartasp2")) === null) {
      localStorage.setItem("cartasp2", JSON.stringify([]));
    }
  };

  criaObjsLocalStorage();

  ///// CRIA O OBJETO DE CARTA TEMPORÁRIA, A SER UTILIZADO QUANDO O PLAYER CLICA EM ALGUMA CARTA

  if (localStorage.getItem("tempcard") === null) {
    localStorage.setItem("tempcard", JSON.stringify([]));
  }

  ////// CONTROLA O NÚMERO DE VEZES QUE O BOTÃO JOGAR FOI CLICADO

  var contaClickJogar = 0;

  $(".botao_jogaragoraClick").click(function() {
    contaClickJogar++;

    console.log(contaClickJogar);

    let classe = $(this).attr("id");

    ///// CRIA OS ARRAYS DOS BARALHOS INTEIROS DOS PLAYERS NO LOCAL STORAGE E INSERE AS CARTAS CONFORME A ESCOLHA DA RAÇA

    if (contaClickJogar === 1) {
      $("h5.escolhaClasse").html(
        "<b>Player 2, Escolha a classse que deseja jogar:</b>"
      );
      criaBaralhoPlayer("player1", classe);
    }
    if (contaClickJogar === 2) {
      $("button.botao_jogaragoraClick").attr("data-toggle", "modal");
      $("button.botao_jogaragoraClick").attr("data-target", "#modalClasses");
      window.location.href = "jogar-1.html";
      criaBaralhoPlayer("player2", classe);
      executaJogo();
    }
  });

  const selecionaBaralho = function(classe) {
    if (classe === "jogarAndroid") {
      var arrayClasse = cartas[0];
    } else if (classe === "jogarMecha") {
      var arrayClasse = cartas[1];
    } else if (classe === "jogarEvoAnimals") {
      var arrayClasse = cartas[2];
    } else if (classe === "jogarHumanos") {
      var arrayClasse = cartas[3];
    } else {
      var arrayClasse = cartas[4];
    }

    return arrayClasse;
  };

  ////// FUNÇÃO CRIA BARALHO DO JOGADOR COM BASE NA OPÇÃO

  const criaBaralhoPlayer = function(player, classe) {
    var cartasPlayer = [];

    let arrayClasse = selecionaBaralho(classe);

    for (let i = 0; i < arrayClasse.length; i++) {
      /// ONDE ESTÁ ESCRITO "cartas[0]" SERÁ INSERIDA UMA VARIÁVEL DINÂMICA QUE MUDA CONFORME A ESCOLHA DA RAÇA
      cartasPlayer.push({
        id: arrayClasse[i].id,
        classe: arrayClasse[i].classe,
        atk: arrayClasse[i].atk,
        def: arrayClasse[i].def,
        img: arrayClasse[i].img()
      });

      // console.log("cartasPlayer", cartasPlayer[i].img());
    }

    if (player === "player1") {
      localStorage.setItem("cartasp1", JSON.stringify(cartasPlayer));
    } else {
      localStorage.setItem("cartasp2", JSON.stringify(cartasPlayer));
    }
  };

  //// FUNÇÃO QUE GERA NÚMEROS ALEATÓRIOS E EXCLUI DO ARRAY DE CARTAS AS CARTAS SORTEADAS

  const random = function(array) {
    let element = array[(Math.random() * array.length) >> 0];

    return element;
  };

  //// INSERE OS TEXTOS IDENTIFICADORES E HP DOS PLAYERS NO HTML

  const insereHP = function(player) {
    let hpPlayerAtivo = null;
    let hpPlayerOpo = null;

    if (player === "player1") {
      hpPlayerAtivo = JSON.parse(localStorage.getItem("hpP1"));
      hpPlayerOpo = JSON.parse(localStorage.getItem("hpP2"));

      $("h4#nome-player-ativo").text("Player 1");
      $("h4#nome-player-oponente").text("Player 2");
    } else {
      hpPlayerAtivo = JSON.parse(localStorage.getItem("hpP2"));
      hpPlayerOpo = JSON.parse(localStorage.getItem("hpP1"));

      $("h4#nome-player-ativo").text("Player 2");
      $("h4#nome-player-oponente").text("Player 1");
    }

    $("h1#hp-player-ativo").text(hpPlayerAtivo.hp);
    $("h1#hp-player-oponente").text(hpPlayerOpo.hp);
  };

  // PEGA 5 CARTAS ALEATÓRIAS DO BARALHO E COLOCA NA MÃO DO JOGADOR (PRIMEIRO TURNO)

  const geraCartasMao = player => {
    let baralho = null;
    if (player === "player1") {
      baralho = JSON.parse(localStorage.getItem("cartasp1"));
    } else {
      baralho = JSON.parse(localStorage.getItem("cartasp2"));
    }

    let cartasMao = [];

    console.log(JSON.parse(localStorage.getItem("cartasp1")));

    for (var i = 0; i < 5; i++) {
      let carta = random(baralho);

      baralho = baralho.filter(i => i !== carta);
      console.log(`array random ${baralho}`);

      cartasMao.push(carta);
    }

    if (player === "player1") {
      localStorage.setItem("cartasMaoP1", JSON.stringify(cartasMao));
      localStorage.setItem("cartasp1", JSON.stringify(baralho));
    } else {
      localStorage.setItem("cartasMaoP2", JSON.stringify(cartasMao));
      localStorage.setItem("cartasp2", JSON.stringify(baralho));
    }
  };

  // PEGA 1 CARTA ALEATÓRIA DO BARALHO E COLOCA NA MÃO DO JOGADOR (PRIMEIRO TURNO)

  const compraCarta = player => {
    let baralho = null;
    let cartasMao = null;
    if (player === "player1") {
      baralho = JSON.parse(localStorage.getItem("cartasp1"));
      cartasMao = JSON.parse(localStorage.getItem("cartasMaoP1"));
    } else {
      baralho = JSON.parse(localStorage.getItem("cartasp2"));
      cartasMao = JSON.parse(localStorage.getItem("cartasMaoP2"));
    }

    if (baralho.length > 0 && cartasMao.length < 5) {
      let carta = random(baralho);

      baralho = baralho.filter(i => i !== carta);

      cartasMao.push(carta);

      if (player === "player1") {
        localStorage.setItem("cartasMaoP1", JSON.stringify(cartasMao));
        localStorage.setItem("cartasp1", JSON.stringify(baralho));
      } else {
        localStorage.setItem("cartasMaoP2", JSON.stringify(cartasMao));
        localStorage.setItem("cartasp2", JSON.stringify(baralho));
      }

      insereCartasMao(player);
    } else {
      console.log("cartas acabaram");
    }
  };

  ///// REMOVE CARTAS DA ARENA NO HTML (ANTES DE INSERIR OUTRAS)

  const removeCartasArena = function() {
    $(`.slot-arena-p-ativo`).html("");
    $(`.cartas-opo`).html("");
  };

  //// INSERE AS CARTAS DA MAO (QUE ESTÃO NO LOCAL-STORAGE) NO CÓDIGO HTML - DE ACORDO COM O PLAYER

  const insereCartasMao = function(player) {
    if (player === "player1") {
      var cartasMao = JSON.parse(localStorage.getItem("cartasMaoP1"));
      var baralho = JSON.parse(localStorage.getItem("cartasp1"));
    } else {
      var cartasMao = JSON.parse(localStorage.getItem("cartasMaoP2"));
      var baralho = JSON.parse(localStorage.getItem("cartasp2"));
    }

    ///// SE O BARALHO NÃO CONTIVER CARTAS, A IMG DE BARALHO SOME

    if (baralho.length === 0) {
      $("div#baralho").addClass("baralho-vazio");
    } else {
      $("div#baralho").removeClass("baralho-vazio");
    }

    console.log(cartasMao);

    let juntaCartas = "";
    for (let i = 0; i < cartasMao.length; i++) {
      //console.log(cartas);
      let carta = cartasMao[i];

      juntaCartas += `
  <div class="col-2">
  <img src="${carta.img}" class="imgCardPlayerAtivo">
  <div class="def">${carta.def}</div>
  <div class="atk">${carta.atk}</div>
  </div>
  `;
    }

    $("#cartas-mao").html(juntaCartas);
  };

  //// INSERE AS CARTAS DA ARENA DO PLAYER OPONENTE (QUE ESTÃO NO LOCAL-STORAGE) NO CÓDIGO HTML - DE ACORDO COM O PLAYER

  const insereCartasOponente = function(player) {
    if (player === "player1") {
      var cartasOpo = JSON.parse(localStorage.getItem("cartasArenaP2"));
    } else {
      var cartasOpo = JSON.parse(localStorage.getItem("cartasArenaP1"));
    }

    //console.log(cartasMao);

    let juntaCartas = "";
    for (let i = 0; i < cartasOpo.length; i++) {
      //console.log(cartas);
      let carta = cartasOpo[i];

      juntaCartas += `
  <div class="col-2">
  <img src="${carta.img}" class="imgCardPlayerOpo">
  <div class="def">${carta.def}</div>
  <div class="atk">${carta.atk}</div>
  </div>
  `;
    }

    $("#cartas-opo").html(juntaCartas);
  };

  //// INSERE AS CARTAS DA ARENA DO PLAYER ATIVO (QUE ESTÃO NO LOCAL-STORAGE) NO CÓDIGO HTML - DE ACORDO COM O PLAYER

  const insereCartasPlayerAtivo = function(player) {
    if (player === "player1") {
      var cartasPlayer = JSON.parse(localStorage.getItem("cartasArenaP1"));
    } else {
      var cartasPlayer = JSON.parse(localStorage.getItem("cartasArenaP2"));
    }

    //console.log(cartasMao);

    let juntaCartas = "";
    for (let i = 0; i < 5; i++) {
      //console.log(cartas);
      let carta = cartasPlayer[i];

      if (cartasPlayer[i] === undefined) {
        juntaCartas += `
    <div class="slot-arena-p-ativo col-2 mx-auto">
    </div>
  `;
      } else {
        juntaCartas += `
      <div class="slot-arena-p-ativo col-2 mx-auto">
      <img src="${carta.img}">
      <div class="def">${carta.def}</div>
      <div class="atk">${carta.atk}</div>
      </div>
    `;
      }
    }

    $("#slots-arena-p-ativo").html(juntaCartas);
  };

  ///////
  ///////

  ///// FUNÇÃO PARA OBTER QUAL O TURNO ATUAL

  const obtemPlayerTurno = function() {
    if (contador % 2 === 0) {
      return "player1";
    } else {
      return "player2";
    }
  };

  //// FUNÇÃO CONTA E CONTROLA AS JOGADAS FEITAS PELO JOGADOR

  var jogadas = 0;
  const aumentaJogada = function() {
    jogadas++;
    $("span#contador-jogadas").text(jogadas);
  };

  ///// AO CLICAR EM UMA CARTA, ELA É ATIVADA E O LOCAL STORAGE ARMAZENA AS PROPRIEDADES DA CARTA CLICADA

  $("body").on("click", "div#cartas-mao .imgCardPlayerAtivo", function() {
    $("img").removeClass("active");
    $(this).addClass("active");

    localStorage.setItem("tempcard", JSON.stringify([]));
    let tempCard = JSON.parse(localStorage.getItem("tempcard"));

    let player = obtemPlayerTurno();

    if (player === "player1") {
      var cartasMao = JSON.parse(localStorage.getItem("cartasMaoP1"));
    } else {
      var cartasMao = JSON.parse(localStorage.getItem("cartasMaoP2"));
    }

    //console.log(cartasMao);

    for (let i = 0; i < cartasMao.length; i++) {
      if (cartasMao[i].img === $(this).attr("src")) {
        tempCard.push({
          id: cartasMao[i].id,
          classe: cartasMao[i].classe,
          atk: cartasMao[i].atk,
          def: cartasMao[i].def,
          img: cartasMao[i].img
        });
        break;
      }
    }

    localStorage.setItem("tempcard", JSON.stringify(tempCard));

    $("div.slot-arena-p-ativo:not(:has(*))").addClass("destaque");
  });

  ///// APÓS TER CLICADO EM UMA CARTA DA MÃO, QUANDO O USUÁRIO CLICA EM UM SLOT DA ARENA, A CARTA É TRANSFERIDA PARA ESTE SLOT

  $("body").on("click", "div.slot-arena-p-ativo.destaque", function() {
    $("div.slot-arena-p-ativo").removeClass("destaque");

    let tempCard = JSON.parse(localStorage.getItem("tempcard"))[0];
    $(this).html(`
      <img src="${tempCard.img}">
  <div class="def">${tempCard.def}</div>
  <div class="atk">${tempCard.atk}</div>
  </div>
  `);

    /////// A CARTA É RETIRADA DA MÃO NO HTML

    $(`#cartas-mao img[src="${tempCard.img}"]`)
      .parent()
      .html("");

    /////// A CARTA É RETIRADA DA MÃO DO JOGADOR NO LOCAL STORAGE

    let player = obtemPlayerTurno();

    if (player === "player1") {
      var cartasMao = JSON.parse(localStorage.getItem("cartasMaoP1"));
      var cartasArena = JSON.parse(localStorage.getItem("cartasArenaP1"));
    } else {
      var cartasMao = JSON.parse(localStorage.getItem("cartasMaoP2"));
      var cartasArena = JSON.parse(localStorage.getItem("cartasArenaP2"));
    }

    $.map(cartasMao, function(val, i) {
      if (cartasMao[i].img === tempCard.img) {
        cartasArena.push(cartasMao[i]);
      }
    });

    cartasMao = cartasMao.filter(e => e.img !== tempCard.img);

    if (player === "player1") {
      localStorage.setItem("cartasMaoP1", JSON.stringify(cartasMao));
      localStorage.setItem("cartasArenaP1", JSON.stringify(cartasArena));
    } else {
      localStorage.setItem("cartasMaoP2", JSON.stringify(cartasMao));
      localStorage.setItem("cartasArenaP2", JSON.stringify(cartasArena));
    }
  });

  ///// APÓS TER CLICADO EM UMA DAS SUAS CARTAS DA ARENA, QUANDO O USUÁRIO CLICA EM UMA CARTA DO OPONENTE A CARTA DELE SUBTRAI O ATAQUE MENOS HP

  $("body").on("click", "div#cartas-opo img", function() {
    if (jogadas < 3) {
      //// VERIFICA SE HÁ ALGUMA CARTA SELECIONADA / ATIVA
      if ($(".slot-arena-p-ativo img.active")[0]) {
        ///// ACRESCENTA UMA JOGADA
        aumentaJogada();

        var tempCard = JSON.parse(localStorage.getItem("tempcard"))[0];

        //// ADICIONA CLASSE "USED" PARA NÃO PERMITIR QUE SEJA USADA MAIS DE UMA VEZ NO TURNO

        $(".slot-arena-p-ativo img.active").addClass("used");
        $(".slot-arena-p-ativo img.active").removeClass("active");

        let vidaOpo = $(this)
          .next()
          .text();
        let atk = tempCard.atk;

        var vidaOpoFinal = vidaOpo - atk;

        /// PISCA A VIDA DA CARTA OPONENTE ATACADA

        let $vida = $(this).next();
        var controle = 0;
        var interval = setInterval(() => {
          controle += 1;
          if (controle === 4) {
            clearInterval(interval);
          }
          $vida.toggleClass("pisca");
        }, 100);

        $(this)
          .next()
          .text(vidaOpoFinal);
      } else {
        console.log("não clicou em carta da arena");
      }

      //// CASO A VIDA FINAL DA CARTA DO OPONENTE SEJA INFERIOR OU MENOR A 0

      if (vidaOpoFinal <= 0) {
        let player = obtemPlayerTurno();

        let cartasOpo = null;
        let hp = null;
        if (player === "player1") {
          cartasOpo = JSON.parse(localStorage.getItem("cartasArenaP2"));
          hp = JSON.parse(localStorage.getItem("hpP2"));
        } else {
          cartasOpo = JSON.parse(localStorage.getItem("cartasArenaP1"));
          hp = JSON.parse(localStorage.getItem("hpP1"));
        }

        ////// FILTRA APENAS AS CARTAS DO LOCAL STORAGE DIFERENTES DA CARTA ABATIDA

        cartasOpo = cartasOpo.filter(e => e.img !== $(this).attr("src"));

        ///// DIMINUI O DANO RESTANTE NA VIDA DO PLAYER

        hp.hp += vidaOpoFinal;

        $("h1#hp-player-oponente").text(hp.hp);

        //// ATRIBUI OS NOVOS VALORES NO LOCAL STORAGE

        if (player === "player1") {
          localStorage.setItem("cartasArenaP2", JSON.stringify(cartasOpo));
          localStorage.setItem("hpP2", JSON.stringify(hp));
        } else {
          localStorage.setItem("cartasArenaP1", JSON.stringify(cartasOpo));
          localStorage.setItem("hpP1", JSON.stringify(hp));
        }

        ////// A CARTA DELE É EXCLUÍDA NO HTML

        $($(this))
          .parent()
          .html("");
      }

      //// CASO TENHA EXCEDIDO AS 3 JOGADAS PISCA O TEXTO
    } else {
      let $valorContaJogadas = $("h2#valor-conta-jogadas");
      let $tituloContaJogadas = $("h3#texto-conta-jogadas");
      var controle = 0;
      var interval = setInterval(() => {
        controle += 1;
        if (controle === 6) {
          clearInterval(interval);
        }
        $tituloContaJogadas.toggleClass("pisca");
        $valorContaJogadas.toggleClass("pisca");
      }, 100);
    }
  });

  ///// AO CLICAR EM UMA CARTA DA ARENA, O LOCAL STORAGE ARMAZENA AS PROPRIEDADES DA CARTA CLICADA

  $("body").on("click", "div.slot-arena-p-ativo img", function() {
    if (!$(this).hasClass("used")) {
      $("div.slot-arena-p-ativo").removeClass("destaque");
      $("img").removeClass("active");
      $(this).addClass("active");

      localStorage.setItem("tempcard", JSON.stringify([]));
      let tempCard = JSON.parse(localStorage.getItem("tempcard"));

      let player = obtemPlayerTurno();

      if (player === "player1") {
        var cartasArena = JSON.parse(localStorage.getItem("cartasArenaP1"));
      } else {
        var cartasArena = JSON.parse(localStorage.getItem("cartasArenaP2"));
      }

      //console.log(cartasMao);

      for (let i = 0; i < cartasArena.length; i++) {
        if (cartasArena[i].img === $(this).attr("src")) {
          tempCard.push({
            id: cartasArena[i].id,
            classe: cartasArena[i].classe,
            atk: cartasArena[i].atk,
            def: cartasArena[i].def,
            img: cartasArena[i].img
          });
          break;
        }
      }
      localStorage.setItem("tempcard", JSON.stringify(tempCard));
    }
  });

  /////// AO CLICAR NO BOTÃO NO BOTÃO DE SETA, PASSA O TURNO

  $("#passa-turno").click(function() {
    ////// VERIFICA SE O TURNO É MAIOR QUE 0 E DESCRESCE O VALOR DO TURNO

    if (parseInt($("#valor-conta-turno").text(), 10) > 0) {
      contador++;

      var valorTurno = 50 - contador;

      $("#valor-conta-turno").text(valorTurno);
    } else {
      //// SE TURNO MENOR QUE 0, PISCA O NUMERO DE TURNOS

      let $textoValorTurno = $("#valor-conta-turno");
      var controle = 0;
      var interval = setInterval(() => {
        controle += 1;
        if (controle === 6) {
          clearInterval(interval);
        }
        $textoValorTurno.toggleClass("pisca");
      }, 100);
    }

    console.log(typeof valorTurno);

    if (valorTurno >= 0) {
      if (contador === 1) {
        geraCartasMao("player2");
      }
      let player = obtemPlayerTurno();
      removeCartasArena();
      insereHP(player);
      insereCartasMao(player);
      insereCartasPlayerAtivo(player);
      insereCartasOponente(player);

      jogadas = 0;
      $("span#contador-jogadas").text(jogadas);

      console.log(contador);
      console.log(obtemPlayerTurno());
    }
  });

  /////// AO CLICAR NA IMG DO BARALHO, O PLAYER ATIVO COMPRA UMA CARTA

  $("#baralho").click(function() {
    if (jogadas < 3) {
      let player = obtemPlayerTurno();
      compraCarta(player);
      aumentaJogada();
    } else {
      let $valorContaJogadas = $("h2#valor-conta-jogadas");
      let $tituloContaJogadas = $("h3#texto-conta-jogadas");
      var controle = 0;
      var interval = setInterval(() => {
        controle += 1;
        if (controle === 6) {
          clearInterval(interval);
        }
        $tituloContaJogadas.toggleClass("pisca");
        $valorContaJogadas.toggleClass("pisca");
      }, 100);
    }
  });

  /////// VARIÁVEL QUE CONTROLA O NÚMERO DE TURNOS

  var contador = 0;

  ////// EXECUTA A FUNÇÃO QUE GERA AS PRIMEIRAS CARTAS DA MÃO (EXECUTA APENAS NO PRIMEIRO TURNO)

  let player = obtemPlayerTurno();

  geraCartasMao(player);

  //// INSERE AS CARTAS DA MÃO DO JOGADOR ATIVO NO HTML

  insereCartasMao(player);

  ///// INSERE OS NOMES DOS PLAYERS

  insereHP(player);
});
