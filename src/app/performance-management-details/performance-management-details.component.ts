import { Component, OnInit } from '@angular/core';
import { MatChipListboxChange } from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { DatetimeService } from '../datetime.service';
import { DisplayService } from '../display.service';
import { DseService } from '../dse.service';
import {
  Comment,
  FunctionType,
  FunctionTypeDisplay,
  IFunction,
  MemberDataDetail,
  MemberStage,
  MemberStageType,
  MemberStageTypeDisplay,
  Role,
  RoleType,
  RoleTypeDisplay
} from '../interfaces';
import { MemberService } from '../member.service';
import { ResponsiveDialogComponent } from '../responsive-dialog/responsive-dialog.component';

@Component({
  selector: 'app-performance-management-details',
  templateUrl: './performance-management-details.component.html',
  styleUrls: ['./performance-management-details.component.scss']
})
export class PerformanceManagementDetailsComponent implements OnInit {

  public memberDetails: MemberDataDetail;
  public ready = false;
  public panelOpenState = false;
  public newRole: RoleType;
  public newFunction: FunctionType;
  public newJobDescription: string;
  public newExpaId: number;
  public newAiesecEmail: string;
  public currentMemberId: number;
  public currentMemberStage: MemberStageType;
  public currentMemberRole: RoleType;
  public currentMemberFunction: FunctionType;
  public memberStages: MemberStage[] = [
    {value: 'accepted', displayValue: 'Accepted'},
    {value: 'approved', displayValue: 'Approved'},
    {value: 'realized', displayValue: 'Realized'},
    {value: 'finished', displayValue: 'Finished'},
    {value: 'completed', displayValue: 'Completed'},
    {value: 'dropped', displayValue: 'Dropped'},
    {value: 'terminated', displayValue: 'Terminated'},
    {value: 'advanced', displayValue: 'Advanced'},
    {value: 'alumni', displayValue: 'Alumni'}
  ];
  public roles: Role[] = [
    {value: 'newbie', displayValue: 'Newbie'},
    {value: 'member', displayValue: 'Member'},
    {value: 'teamLeader', displayValue: 'Team Leader'},
    {value: 'vicePresident', displayValue: 'Vice President'}
  ];
  public functions: IFunction[] = [
    {value: 'finance', displayValue: 'Finance'},
    {value: 'marketing', displayValue: 'Marketing'},
    {value: 'outgoingGlobalVolunteer', displayValue: 'Outgoing Global Volunteer'},
    {value: 'outgoingGlobalTalent', displayValue: 'Outgoing Global Talent'},
    {value: 'incomingGlobalVolunteer', displayValue: 'Incoming Global Volunteer'},
    {value: 'incomingGlobalTalent', displayValue: 'Incoming Global Talent'},
    {value: 'talentManagement', displayValue: 'Talent Management'}
  ];

  constructor(
    private memberService: MemberService,
    private displayService: DisplayService,
    private dateService: DatetimeService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private dseService: DseService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentMemberId = params['id'];
      this.fetchMemberDetails();
    });
  }

  public fetchMemberDetails() {
    try {
      this.memberService.getMemberDetails(this.currentMemberId).subscribe(memberData => {
        this.memberDetails = memberData;
        this.newExpaId = this.memberDetails.expaId;
        this.newAiesecEmail = this.memberDetails.aiesecEmail;
        this.currentMemberStage = this.memberDetails.currentRole.stage;
        this.currentMemberRole = this.memberDetails.currentRole.role;
        this.currentMemberFunction = this.memberDetails.currentRole.function;
        this.ready = true;
      });
    } catch (err) {
      if(err instanceof Error) {
        this.snackbar.open(err.message, '', { duration: 5000 });
      } else {
        this.snackbar.open('Member Details could not be fetched', '', { duration: 5000 });
      }
    }
  }

  public updateMemberData() {
    try {
      this.memberService.updateMember(this.memberDetails).subscribe(() => {
        this.snackbar.open('Member has been updated successfully', '', { duration: 2000 });
        this.fetchMemberDetails();
      });
    } catch (err) {
      if(err instanceof Error) {
        this.snackbar.open(err.message, '', { duration: 5000 });
      } else {
        this.snackbar.open('Member could not be updated!', '', { duration: 5000 });
      }
    }
  }

  public updateStage() {
    const oldStage = this.transformStageView(this.memberDetails.currentRole.stage);
    this.memberDetails.currentRole.stage = this.currentMemberStage;
    const newStage = this.transformStageView(this.memberDetails.currentRole.stage);

    const entry = `Updated Stage: ${oldStage} to ${newStage}`;
    const newComment: Comment = {
      changedAt: new Date(),
      entry: entry,
      userTyped: false
    };

    this.memberDetails.comments.push(newComment);

    switch (this.currentMemberStage) {
      case 'realized':
        this.memberDetails.currentRole.dateOfRealized = new Date();
        break;
      case 'dropped':
        this.memberDetails.currentRole.lastDateInRole = new Date();
        this.memberDetails.pastRole?.push({ ...this.memberDetails.currentRole });
        this.memberDetails.currentRole.function = 'none';
        this.memberDetails.currentRole.role = 'none';
        break;
      case 'terminated':
        this.memberDetails.currentRole.lastDateInRole = new Date();
        this.memberDetails.pastRole?.push({ ...this.memberDetails.currentRole });
        this.memberDetails.currentRole.function = 'none';
        this.memberDetails.currentRole.role = 'none';
        break;
      case 'advanced':
        this.memberDetails.currentRole.lastDateInRole = new Date();
        this.memberDetails.pastRole?.push({ ...this.memberDetails.currentRole });
        this.memberDetails.currentRole.function = 'none';
        this.memberDetails.currentRole.role = 'none';
        this.memberDetails.currentRole.stage = 'accepted';
        break;
      case 'alumni':
        this.memberDetails.currentRole.lastDateInRole = new Date();
        this.memberDetails.pastRole?.push({ ...this.memberDetails.currentRole });
        this.memberDetails.currentRole.function = 'none';
        this.memberDetails.currentRole.role = 'none';
        break;
      default:
        break;
    }

    this.updateMemberData();
  }

  public updateRole(event: MatChipListboxChange) {
    this.newRole = event.value;
  }

  public updateFunction(event: MatChipListboxChange) {
    this.newFunction = event.value;
  }

  public async addNewRole() {
    if(this.newRole === undefined || this.newFunction === undefined) { return }
    this.memberDetails.currentRole.role = this.newRole;
    this.memberDetails.currentRole.function = this.newFunction;
    this.memberDetails.currentRole.jobDescription = this.newJobDescription;
    const entry = `Added new role: ${this.transformRoleView(this.newRole)} of ${this.transformFunctionView(this.newFunction)}`;
    const newComment: Comment = {
      changedAt: new Date(),
      entry: entry,
      userTyped: false
    };

    this.memberDetails.comments.push(newComment);

    const THREE_MONTHS = DateTime.local().plus({months: 3}).toJSDate();
    const SIX_MONTHS = DateTime.local().plus({months: 6}).toJSDate();
    const TWELVE_MONTHS = DateTime.local().plus({months: 12}).toJSDate();

    switch (this.memberDetails.currentRole.role) {
      case 'newbie':
        this.memberDetails.currentRole.endOfTerm = THREE_MONTHS;
        break;
      case 'member':
        this.memberDetails.currentRole.endOfTerm = SIX_MONTHS;
        break;
      case 'teamLeader':
        this.memberDetails.currentRole.endOfTerm = SIX_MONTHS;
        break;
      case 'vicePresident':
        this.memberDetails.currentRole.endOfTerm = TWELVE_MONTHS;
        break;
      default:
        break;
    }

    try {
      this.memberService.addNewRole(this.memberDetails).subscribe(() => {
        this.snackbar.open('New role has been added successfully', '', { duration: 2000 });
        this.fetchMemberDetails();
      });
    } catch (err) {
      if(err instanceof Error) {
        this.snackbar.open(err.message, '', { duration: 5000 });
      } else {
        this.snackbar.open('New role could not be saved!', '', { duration: 5000 });
      }
    }
  }

  public openAdvancedRoleDialog() {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(ResponsiveDialogComponent, dialogConfig);
  }

  public saveData() {
    if(
      this.newExpaId === this.memberDetails.expaId &&
      this.newAiesecEmail === this.memberDetails.aiesecEmail
    ) { return; }
    this.memberDetails.expaId = this.newExpaId;
    this.memberDetails.aiesecEmail = this.newAiesecEmail;
    try {
      this.memberService.addMemberInfo(this.memberDetails).subscribe(() => {
        this.snackbar.open('Member has been updated successfully', '', { duration: 2000 });
        this.fetchMemberDetails();
      });
    } catch (err) {
      if(err instanceof Error) {
        this.snackbar.open(err.message, '', { duration: 5000 });
      } else {
        this.snackbar.open('Member could not be updated!', '', { duration: 5000 });
      }
    }
  }

  public uploadDoc(event: Event) {
    if(!event) { return; }
    const e = (event.target) as HTMLInputElement;
    if(!e.files) { return; }
    const file: File = e.files[0];
    if(!file) { return; }
    try {
        this.dseService.uploadDocument(file)
        .subscribe(() => {
          try {
            this.memberService.verifyMembership(this.memberDetails).subscribe(() => {
              this.snackbar.open('Document Upload successful', '', { duration: 2000 });
            });
          } catch (err) {
            if(err instanceof Error) {
              this.snackbar.open(err.message, '', { duration: 5000 });
            }
          }
        });
    } catch(err) {
        if(err instanceof Error) {
            this.snackbar.open(err.message, '', { duration: 5000 });
        }
    }
  }

  public transformStageView(stage: MemberStageType): MemberStageTypeDisplay | string {
    return this.displayService.getMemberStageDisplayValue(stage);
  }

  public transformRoleView(role: RoleType): RoleTypeDisplay | string {
    return this.displayService.getMemberRoleDisplayValue(role);
  }

  public transformFunctionView(functionName: FunctionType): FunctionTypeDisplay | string {
    return this.displayService.getMemberFunctionDisplayValue(functionName);
  }

  public transformDate(date: unknown): string {
    return this.dateService.transformDate(date as string);
  }
}
