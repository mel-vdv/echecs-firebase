import { CrudservService } from './../../services/crudserv.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fin',
  templateUrl: './fin.component.html',
  styleUrls: ['./fin.component.scss']
})
export class FinComponent implements OnInit {

  constructor(
    private ar : ActivatedRoute
    , private crud: CrudservService
  ) { }

  parSub:any;
  num: any;
  stats: any;

  ngOnInit(): void {
    this.parSub = this.ar.paramMap.subscribe((params: any) => {
      this.num = params.get('num');
      this.crud.getStat(this.num).subscribe(data=>{
        this.stats=data;
      })
    });
  }
  /////////////////////////////////////////

}
