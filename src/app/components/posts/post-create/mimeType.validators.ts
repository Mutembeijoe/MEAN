import { Observable, Subscriber } from 'rxjs';
import { AbstractControl } from '@angular/forms';

export const mimeType = (
  control: AbstractControl
):
  | Promise<{ [key: string]: any } | null>
  | Observable<{ [key: string]: any } | null> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const $fileObs = new Observable(
    (subscriber: Subscriber<{ [key: string]: any } | null>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );
        let header = '';
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          subscriber.next(null);
        } else {
          subscriber.next({ invalidMimeType: true });
        }
        subscriber.complete();
      });

      fileReader.readAsArrayBuffer(file);
    }
  );

  return $fileObs;
};