'use strict';

$(function() {
    browser.runtime.getBackgroundPage().then((global) => {
        browser.tabs.query({'active': true, 'currentWindow': true}).then((tabs) => {
            if (tabs.length === 0) {
                return; // For example: only the background devtools or a popup are opened
            }
            const tab = tabs[0];

            const logins = global.page.tabs[tab.id].loginList;
            let ll = document.getElementById('login-list');
            for (let i = 0; i < logins.length; i++) {
                const a = document.createElement('a');
                a.textContent = logins[i];
                a.setAttribute('class', 'list-group-item');
                a.setAttribute('id', '' + i);
                a.addEventListener('click', (e) => {
                    const id = e.target.id;
                    browser.tabs.sendMessage(tab.id, {
                        action: 'fill_user_pass_with_specific_login',
                        id: Number(id)
                    });
                    close();
                });
                ll.appendChild(a);
            }
			
            if (logins.length > 1) {
                document.getElementById('filter-block').style = '';
                let filter = document.getElementById('login-filter');
                filter.addEventListener('keyup', (e) => {
                    let val = filter.value;
                    let re = new RegExp(val, 'i');
                    let links = ll.getElementsByTagName('a');
                    for (let i in links) {
                        if (links.hasOwnProperty(i)) {
                            let found = String(links[i].textContent).match(re) !== null;
                            links[i].style = found ? '' : 'display: none;';
                        }
                    }
                });
                filter.focus();
            }
        });
    });

    $('#lock-database-button').click(function() {
        browser.runtime.sendMessage({
            action: 'lock-database'
        });
    });
});
