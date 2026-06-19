$(function () {

    // Data de hoje
    $("#data").val(new Date().toISOString().split('T')[0]);    

    //$("#btnImprimir").click();

    $('#pesos_box').html('');  //limpar pesos teste do rel

});

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

    // Converte para float
    preco = parseFloat(preco.replace(/\./g, '').replace(',', '.'));

    let peso_digitado = $('#input_peso').val().trim();

    if (peso_digitado === '') {
        alert("Informe o campo Peso(Kg).");
        return;
    }   


    let linha = `
        <tr>
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
                    value="R$ 0,00"
                    readonly>

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

}

/*=========================================
 REMOVER
=========================================*/

$(document).on("click", ".btn-excluir", function () {

    $(this).closest("tr").remove();

    calcular();

});

/*=========================================
 CALCULAR
=========================================*/

$(document).on("keyup change", ".quantidade,.peso,.preco", function () {

    calcular();

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
    let col_peso = `
        <div class="col-2 border border-secondary text-center">
            ${peso_digitado}
        </div>
    `;

    $('#rel_valor_kg').html( 'R$ ' + $('#preco').val() );
    $('#rel_peso_total').html( $('#pesoTotal').html() );
    $('#rel_valor_total').html( $('#valorTotal').html() );

    $("#pesos_box").append(col_peso);

}


/*=========================================
 NOVA DESPESCA
=========================================*/

$("#btnNovo").click(function () {

    if (!confirm("Deseja iniciar uma nova despesca?"))
        return;

    $("#tanque").val("");

    $("#comprador").val("");

    $("#observacao").val("");

    $("#tblPeixes tbody").html("");

    adicionarLinha();

    calcular();

});

/*=========================================
 IMPRIMIR
=========================================*/

$("#btnImprimir").click(function () {

    window.print();

});