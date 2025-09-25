// Executa o código após a página ser carregada para garantir que o elemento exista
window.addEventListener('load', function() {
      var hoje = new Date()
      var gregorianohoje = {
            ano: hoje.getFullYear(),
            mes: hoje.getMonth()+1,
            dia: hoje.getDate()
      }
      const anogregorianohoje = document.getElementById('anogregoriano');
      const mesgregorianohoje = document.getElementById('mesgregoriano');
      const diagregorianohoje = document.getElementById('diagregoriano');
      // Define a opção com o valor "verde" como a selecionada
      anogregorianohoje.value = `${gregorianohoje.ano}`;
      mesgregorianohoje.value = `${gregorianohoje.mes}`;
      diagregorianohoje.value = `${gregorianohoje.dia}`;
      julianoparalunar(gregorianoparajuliano(gregorianohoje.ano,gregorianohoje.mes,gregorianohoje.dia))
});