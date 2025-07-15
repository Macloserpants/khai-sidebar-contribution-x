import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root'})
export class TextService{
    //使用BehaviorSubject 保存最新的text
    private textSubject = new BehaviorSubject<string>('');
    public text$ = this.textSubject.asObservable();

    
    //更新text
    updateText(text: string){
        this.textSubject.next(text);
    }
}