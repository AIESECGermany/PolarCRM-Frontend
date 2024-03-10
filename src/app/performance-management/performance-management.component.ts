import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemberData } from '../interfaces';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-performance-management',
  templateUrl: './performance-management.component.html',
  styleUrls: ['./performance-management.component.scss']
})
export class PerformanceManagementComponent implements OnInit {

  public includeArchived = false;
  public members: MemberData[];
  public selectedMemberId = 3;
  public ready = false;

  constructor(
    private memberService: MemberService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    try {
      this.memberService.getMembers(this.includeArchived).subscribe(members => {
        this.members = members;
        this.ready = true;
      });
    } catch (err) {
      if(err instanceof Error) {
        this.snackbar.open(err.message, '', { duration: 5000 });
      } else {
        this.snackbar.open('Members could not be fetched', '', { duration: 5000 });
      }
    }
  }
}
