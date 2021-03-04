import { PipeTransform, Pipe } from '@angular/core';

//this pipe will be used for filtering for ' *ngFor '
@Pipe({
    name: 'callback',
    pure: false
})
/**
 * Accepts any callback function
 * Performs the callback function to filter the given array
 * The resultant filtered array will be fed into *ngFor
 */
export class CallbackPipe implements PipeTransform {
    transform(items: any[], callback: (item: any) => boolean): any {
        if (!items || !callback) {
            return items;
        }
        return items.filter(item => callback(item));
    }
}