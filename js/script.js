$( document ).ready(function() {

    var id_pesagem = 0;
    
    $("#data").val(new Date().toISOString().split('T')[0]);      // Data de hoje
    $('#pesos_box').html('');  //limpar pesos teste do rel    
    
    
    /*  inicio recupoeracao dados storage */

        if( localStorage.getItem('data') !== null ) {

            if (confirm("Recuperar dados da despesca anterior?")) {
                // clicou em SIM
                $('#data').val(localStorage.getItem('data'));
                $('#tanque').val(localStorage.getItem('tanque'));
                $('#comprador').val(localStorage.getItem('piscicultor'));
                $('#preco').val(localStorage.getItem('preco'));
                $("#tblPeixes tbody").html(localStorage.getItem('html_pesos'));
                $("#pesos_box").html(localStorage.getItem('html_pesos_rel'))

                $("#preco").prop('readonly',true);

                calcular();
                preencher_relatorio();
                
            } else {
                // clicou em NÃO
                nova_despesca();
            }

        }

    /*  fim recupoeracao dados storage */




    /*=========================================
    ADICIONAR LINHA
    =========================================*/

    $("#btnAdicionar").click(function () {
        adicionarLinha();
    });

    function adicionarLinha() {        

        let preco = $('#preco').val().trim();

        if (preco === '') {
            alert("Informe o preço por kg.");
            return;
        }   

        let peso_digitado = $('#input_peso').val().trim();

        if (peso_digitado === '') {
            alert("Informe o campo Peso(Kg).");
            return;
        }   

        id_pesagem = id_pesagem + 1;
        
        let linha = `
            <tr data-id="${id_pesagem}">
                <td>

                    <input
                        type="number"
                        min="0"
                        step="0.001"
                        class="form-control peso"                        
                        readonly
                        value="${peso_digitado}">

                </td>

                <td class="d-none">

                    <input
                        type="number"   
                        class="form-control preco"
                        readonly 
                        value="${preco}">

                </td>

                <td>

                    <input
                        type="text"
                        class="form-control subtotal"        
                        value=""                
                        >

                </td>

                <td class="text-center">

                    <button class="btn btn-danger btn-excluir">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `;

        $("#tblPeixes tbody").append(linha);

        calcular();
        preencher_relatorio();
        $('#input_peso').val('');
        $('#preco').prop('readonly', true);

        //salvar dados no navegador
        salvar_dados();              

    }

    function salvar_dados() {
        localStorage.setItem('piscicultor', $('#comprador').val());
        localStorage.setItem('data', $('#data').val());
        localStorage.setItem('tanque', $('#tanque').val());
        localStorage.setItem('preco', $('#preco').val());
        localStorage.setItem('html_pesos', $("#tblPeixes tbody").html());       
        localStorage.setItem('peso_total', $("#pesoTotal").html());       
        localStorage.setItem('valor_total', $("#valorTotal").html());       
        localStorage.setItem('html_pesos_rel', $("#pesos_box").html()); 
    }


    /*=========================================
    REMOVER
    =========================================*/

    $(document).on("click", ".btn-excluir", function () {
        let id = $(this).closest("tr").data("id");
        $(this).closest("tr").remove();
        calcular();
        
        $(`#${id}`).remove();  //remove div pesagem no relatorio
        $('#rel_peso_total').html( $('#pesoTotal').html() );  //atualiza peso total no rel
        $('#rel_valor_total').html( $('#valorTotal').html() );   //atualiza valor total no relatorio

        salvar_dados();         

    });

    /*=========================================
    CALCULAR
    =========================================*/

    $(document).on("keyup change", ".quantidade,.peso,.preco", function () {

        //calcular();

    });

    function calcular() {

        let quantidadeTotal = 0;
        let pesoTotal = 0;
        let valorTotal = 0;

        $("#tblPeixes tbody tr").each(function () {

            let quantidade = parseFloat($(this).find(".quantidade").val()) || 0;

            let peso = parseFloat($(this).find(".peso").val()) || 0;

            let preco = parseFloat($(this).find(".preco").val()) || 0;

            let subtotal = peso * preco;

            $(this).find(".subtotal").val(

                subtotal.toLocaleString('pt-BR', {

                    style: 'currency',
                    currency: 'BRL'

                })

            );

            $(this).find(".subtotal").attr('value', $(this).find(".subtotal").val()); //mudar atr value no html tambem

            quantidadeTotal += quantidade;
            pesoTotal += peso;
            valorTotal += subtotal;

        });

        let pesoMedio = 0;

        if (quantidadeTotal > 0) {

            pesoMedio = pesoTotal / quantidadeTotal;

        }

        $("#totalQuantidade").text(quantidadeTotal);

        $("#pesoTotal").text(

            pesoTotal.toFixed(2).replace(".", ",") + " Kg"

        );

        $("#pesoMedio").text(

            pesoMedio.toFixed(3).replace(".", ",") + " Kg"

        );

        $("#valorTotal").text(

            valorTotal.toLocaleString('pt-BR', {

                style: 'currency',
                currency: 'BRL'

            })

        );
        

    }


    function preencher_relatorio() {

        $('#rel_piscicultor').html( $('#comprador').val() );
        $('#rel_data').html(
            $('#data').val().split('-').reverse().join('/')
        );

        let peso_digitado = $('#input_peso').val().trim();
        peso_digitado = peso_digitado.replace('.', ',');

        if(peso_digitado !== '') {
            let html_peso = `
                <div class="item border border-secondary text-center" id="${id_pesagem}">${peso_digitado}</div>
            `;

            $("#pesos_box").append(html_peso);
        }         

        $('#rel_valor_kg').html( 'R$ ' + $('#preco').val().replace('.', ',') );
        $('#rel_peso_total').html( $('#pesoTotal').html() );
        $('#rel_valor_total').html( $('#valorTotal').html() );   

    }


    /*=========================================
    NOVA DESPESCA
    =========================================*/

    $("#btnNovo").click(function () {

        if (!confirm("Deseja iniciar uma nova despesca?"))
            return;

        nova_despesca();

    });

    function nova_despesca() {

        $("#tanque").val("");
        $("#comprador").val("");  
        $("#preco").val("");  
        $("#preco").prop('readonly',false);
        $('#rel_valor_kg').html('');
        $('#rel_peso_total').html('');
        $('#rel_valor_total').html('');   
        $("#tblPeixes tbody").html("");   
        $("#pesos_box").html('');
        localStorage.clear();

        calcular();

    }

    /*=========================================
    IMPRIMIR
    =========================================*/

    $("#btnImprimir").click(function () {

        window.print();

    });







});






