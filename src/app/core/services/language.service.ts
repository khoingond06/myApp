import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'app_lang';
  private currentLang: string = 'vi';

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage() {
    const savedLang = localStorage.getItem(this.LANG_KEY);
    this.currentLang = savedLang ? savedLang : 'vi';
    
    this.translate.addLangs(['vi', 'en']);
    this.translate.setDefaultLang('vi');
    this.translate.use(this.currentLang);
  }

  setLanguage(lang: string) {
    this.currentLang = lang;
    localStorage.setItem(this.LANG_KEY, lang);
    this.translate.use(lang);
  }

  getCurrentLang(): string {
    return this.currentLang;
  }
}
