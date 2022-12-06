import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-save-list-button',
  templateUrl: './save-list-button.component.html',
  styleUrls: ['./save-list-button.component.scss']
})
export class SaveListButtonComponent implements OnInit {
  @Input() text: string;
  @Output() saveBtnClick = new EventEmitter();

  ngOnInit(): void {}

  onClick() {
    this.saveBtnClick.emit();
  }
}
