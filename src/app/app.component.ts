import { Component, OnInit } from '@angular/core';
import { BackendApiService } from './services/backend-api.service';
import { SeatStatus, Passenger, Seat } from '../enums';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
// import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ BackendApiService ]
})
export class AppComponent implements OnInit {
  title = 'app';
  passengers: Passenger[];
  seatsRows: any[];
  currPassenger: Passenger;
  totalPrice: number;
  seatStatus: any = SeatStatus;
  alerts: any[] = [];

  constructor(private serrvice: BackendApiService, private confirmationDialogService: ConfirmationDialogService) {

  }

  ngOnInit(): void {
    this.serrvice.getData().then((response) => {
      this.passengers = response.passengers;
      this.seatsRows = response.seatsRows;

      this.currPassenger = this.passengers[0];
    });
  }

  seatClicked(seat) {
    if (seat.status === SeatStatus.free) {
      this.serrvice.takeSeat(seat.id).then((response) => {
        if (response.status) {
          // delete prev seat
          if (this.currPassenger.seat) {
            this.resetSeat(this.currPassenger.seat);
          }
          this.currPassenger.seat = seat;
          seat.status = SeatStatus.allocatedSuccessfully;
          seat.takenBy = this.currPassenger.id;
          this.updateTotalPrice();
        }
      });
    }
    else if (seat.status === SeatStatus.allocatedSuccessfully && seat.takenBy === this.currPassenger.id) {
      // update server ???
      this.currPassenger.seat = null;
      this.resetSeat(seat);
      this.updateTotalPrice();
    }
  }

  updateTotalPrice() {
    this.totalPrice = 0;
    this.passengers.forEach(passenger => {
      if (passenger.seat && passenger.seat.price) {
        this.totalPrice += +passenger.seat.price;
      }
    });
  }

  cancelSeats() {
    this.passengers.forEach(passenger => {
      if (passenger.seat) {
        this.resetSeat(passenger.seat);
      }
      passenger.seat = null;
    });
    this.updateTotalPrice();
  }

  resetSeat(seat: Seat) {
    seat.status = SeatStatus.free;
    seat.takenBy = null;
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  save() {
    this.confirmationDialogService.confirm('שמירה', 'האם אתה בטוח?')
    .then((confirmed) => {
      if (confirmed) {
        this.serrvice.save(this.passengers).then((res) => {
          this.showAlert('success', 'המושבים נשמרו עבורך!');
        });
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  close(alert: any) {
    this.alerts[this.alerts.indexOf(alert)].deleted = true;
    setTimeout(() => {
      this.alerts.splice(this.alerts.indexOf(alert), 1);
    }, 300);
  }

  showAlert(type, message, autoHide = true) {
    const alert = { 'type': type, 'message': message };
    this.alerts.push(alert);
    if (autoHide) {
      setTimeout(() => {
        this.close(alert);
      }, 3000);
    }
  }

}
