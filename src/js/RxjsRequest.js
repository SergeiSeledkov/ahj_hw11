import { ajax } from 'rxjs/ajax';
import { mergeMap, catchError } from 'rxjs/operators';
import { interval, of } from 'rxjs';

export default class RxjsRequest {
  constructor() {
    this.url = 'https://ahj-hw11-server.herokuapp.com/messages/unread';
    this.messagesContainer = document.querySelector('.messages__container');
  }

  start() {
    interval(10000).pipe(
      mergeMap(() => ajax.getJSON(this.url).pipe(
        catchError((err) => of(err)),
      )),
    ).subscribe({
      next: (response) => {
        if (response.status !== 'ok') {
          console.log('Not new message');
        } else if (response.messages.length !== 0) {
          for (const i of response.messages) {
            this.newElement(i);
          }
        } else {
          this.newElement(response.messages);
        }
      },
    });
  }

  newElement(elem) {
    const container = document.createElement('div');
    const email = document.createElement('div');
    const text = document.createElement('div');
    const date = document.createElement('div');

    container.classList.add('messages__container-message');
    email.classList.add('messages__container-message-mail');
    text.classList.add('messages__container-message-text');
    date.classList.add('messages__container-message-date');

    email.textContent = elem.from;
    text.textContent = this.formattedText(elem.body);
    date.textContent = this.formattedDate(elem.received);

    container.append(email);
    container.append(text);
    container.append(date);

    this.messagesContainer.prepend(container);
  }

  formattedDate(date) {
    const arrDateTime = date.split('T');
    const arrDate = arrDateTime[0].split('-');
    const arrTime = arrDateTime[1].split(':');

    return `${arrTime[0]}:${arrTime[1]} ${arrDate[2]}.${arrDate[1]}.${arrDate[0]}`;
  }

  formattedText(text) {
    const str = text;

    if (str.length > 15) {
      return `${str.substr(0, 15)}...`;
    }
    return str;
  }
}
