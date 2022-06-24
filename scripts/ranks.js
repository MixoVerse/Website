// Copyright (C) 2022  Marcus Huber (Xenorio)

// This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.

$(document).ready(() => {

    $.getJSON('https://api.mixoverse.net/products', (data) => {
        let products = data

        let head = ""

        for (let product in products) {
            product = products[product]

            head += `<th style="color: white;font-family: 'Fredoka One', cursive;">` + product.name + "</th>"

        }

        head = "<tr>" + head + "</tr>"

        $('#ranktable-head').html(head)

        let body = ""
        let i = 0

        while (true) {
            let addition = ""

            let found = false

            for (let product in products) {
                product = products[product]

                if (product.content[i]) {
                    found = true
                    addition += '<td style="color: white;">' + product.content[i] + "</td>"
                } else {
                    addition += "<td></td>"
                }

            }

            if (!found) break;

            i += 1

            body += "<tr>" + addition + "</tr>"

        }

        $('#ranktable-body').html(body)


    })



})