// Copyright (C) 2022  Marcus Huber (Xenorio)

// This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.

let products;
let username;
let owned;

$.getJSON('/api/products', (data) => {
    products = data
})

$(document).ready(() => {
    $('#agb-checkbox').prop('checked', false);
})

function showError(error) {
    $('#error').html(`<h3>${error}</h3>`)
    $('#error').show()
}

function adjustPrice(product) {

    let price = product.price

    for (let x in products) {
        x = products[x]
        if (x.id > owned) break
        if (x.id == owned) price = price - x.price
    }

    return price

}

function loadTable() {

    let table = ""

    for (let id in products) {
        let product = products[id]

        if (owned != undefined && product.id <= owned) continue

        let price = adjustPrice(product)

        table += `
<tr>
    <td>
        ${product.name}
    </td>
    
    <td>
        ${price}€
    </td>
    
    <td>
        <button class="btn btn-success" onclick="loadModal('${id}')"><i class="fa-solid fa-scroll"></i> Inhalt</button>
    </td> 
    
    <td>
        <button class="btn btn-warning" onclick="order('${id}')"><i class="fa-solid fa-basket-shopping"></i> Bestellen</button>
    </td> 
</tr>`

    }

    $('#table-body').html(table)

}

function loadShop() {

    username = $('#shop-username').val()

    $.getJSON('/api/userinfo?username=' + username, data => {

        if (data.error) {
            showError(data.error)
            return
        }

        owned = data.owned

        loadTable()

        $('#shop-username-form').hide()
        $('#shop').show()

    }).fail(() => {
        showError('Ups! Anscheinend hat der Shop gerade Probleme.<br>Ein Discord-Ping an Xenorio wäre ganz nett :)')
    })

}

function loadModal(product) {

    $('#modal-title-product').text(products[product].name)

    let productContent = ""

    for (let content of products[product].content) {
        productContent += "<li>" + content + "</li>"
    }

    $('#modal-content-list').html(productContent)

    let bsModal = new bootstrap.Modal(document.getElementById('contentModal'), {
        keyboard: false
    })

    bsModal.toggle()

}

function order(name) {
    let product = products[name]

    if (!$('#agb-checkbox').prop('checked')) {
        showError('Bitte akzeptiere zuerst die AGB')
        return
    }

    $.getJSON(`/api/prepareorder?username=${username}&product=${product.id}`, data => {

        if (data.error) {
            showError(data.error)
            return
        }

        window.location.href = data.url

    })

}

function donate() {

    let amount = parseFloat($('#shop-donate').val())

    if (isNaN(amount)) {
        showError('Ungültige Summe')
        return
    }

    if (amount > 100 || amount < 1) {
        showError('Es sind nur Spendensummen von 1-100€ möglich')
        return
    }

    if (!$('#agb-checkbox').prop('checked')) {
        showError('Bitte akzeptiere zuerst die AGB')
        return
    }

    $.getJSON(`/api/preparedonation?username=${username}&amount=${amount}`, data => {

        if (data.error) {
            showError(data.error)
            return
        }

        window.location.href = data.url

    })

}