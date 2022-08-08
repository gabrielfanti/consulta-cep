const $zipcode = document.querySelector('#zipcode');
const $output = document.querySelector('#output');
const msg = {
    'zipcode_invalid': 'O Cep informado é inválido.',
    'zipcode_notfound': 'O Cep informado não existe!',
    'zipcode_error': 'Ocorreu um erro ao realizar a consultda do Cep, tente novamente.'
}

VMasker($zipcode).maskPattern("99999-999");

document.querySelector("#search").addEventListener('submit', getZipcode);

function getZipcode(event) {
    event.preventDefault();
    loading('on');

    if (!zipcodeValidation($zipcode.value)) {
        loading('off');
        $output.innerHTML = showMessage(msg.zipcode_invalid, 'is-danger');
        $zipcode.focus();
        throw Error(msg.zipcode_invalid);
    }

    fetch(`https://viacep.com.br/ws/${$zipcode.value}/json/`)
        .then(response => {
            loading('off');

            if (response.status != 200) {
                $output.innerHTML = showMessage(msg.zipcode_error, 'is-danger');
                $zipcode.focus();
                throw Error(response.status)
            } else {
                return response.json();
            }
        })

        .then(data => {
            loading('off');
            if (data.erro) {
                $output.innerHTML = showMessage(msg.zipcode_notfounde, 'is-warning');
                $zipcode.focus();
            } else {
                const message = `
            <ul>
                <li><strong>Endereço: </strong>${data.logradouro}<li>
                <li><strong>Complemento: </strong>${data.complemento}<li>
                <li><strong>Bairro: </strong>${data.bairro}<li>
                <li><strong>Cidade: </strong>${data.localidade}<li>
                <li><strong>Estado: </strong>${data.uf}<li>  
            </ul>  
            `;
                $output.innerHTML = showMessage(message)
            }
        })
        .catch(err => console.log(err))
}

function zipcodeValidation(value) {
    return /(^[0-9]{5}-[0-9]{3}$|^[0-9]{8}$)/.test(value) ? true : false;
}

function loading(status) {
    let is_invisible = (status == 'on') ? '' : 'is-invisibled';
    $output.innerHTML = `
        <div class="has-text-centered">
            <span class="button is-white is-size-2 is-loading ${is_invisible}"></span>
        </div>
    `
}

function showMessage(message, typeMessage = " ") {
    return `
        <article class="message ${typeMessage}">
            <div class="message-header">
                <p>CEP: <strong></strong></p>
                <button class="delete" aria-label="delete"></button>
            </div>
            <div class="message-body">${message}</div>
        </article>
        `
}