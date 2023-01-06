<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5">Queue Ticket System</h1>
    <form @submit.prevent="generateTicket" class="form-inline justify-content-center">
      <label for="name" class="sr-only">Name:</label>
      <input type="text" v-model="name" placeholder="Enter your name" class="form-control mr-2">
      <label for="service" class="sr-only">Service:</label>
      <select v-model="service" class="form-control mr-2">
        <option v-for="service in services" :key=service>{{ service.text }}</option>
      </select>
      <button type="submit" class="btn btn-primary">Generate Ticket</button>
    </form>
    <hr>
    <transition name="fade">
      <div v-if="ticketNumber" class="card my-5">
        <div class="card-body">
          <h2 class="card-title text-center">Your ticket number is: {{ ticketNumber }}</h2>
          <h3 class="card-subtitle mb-3 text-center">Service: {{ service }}</h3>
          <h3 class="card-subtitle mb-3 text-center">Current Number: {{ currentNumber[service] }}</h3>
          <div class="text-center">
            <button @click="printTicket" class="btn btn-secondary">Print Ticket</button>
          </div>
        </div>
      </div>
    </transition>
    <hr>
    <div>
      <h2 class="text-center mb-3">Queue Tickets</h2>
      <div class="row">
        <div class="col-md-4" v-for="service in services" :key=service>
          <h3>{{ service.text }}</h3>
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Ticket Number</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in tickets[service.value]" :key=ticket>
                <td>{{ ticket.name }}</td>
                <td>{{ ticket.ticket_number }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  data() {
    return {
      name: '',
      service: '',
      tickets: [],
      services: [
        { value: 'medical', text: 'Medical' },
        { value: 'dental', text: 'Dental' },
        { value: 'optical', text: 'Optical' }
      ],
      ticketNumber: '',
      currentNumber: {
        medical: 0,
        dental: 0,
        optical: 0
      }
    }
  },
  methods: {
    async generateTicket() {
      // Get the current number of the queue ticket for the selected service
      this.$http.get(`http://localhost:3000/current/${this.service}`)
        .then(response => {
          // Increment the current number by 1
          this.currentNumber[this.service] = response.data.count + 1;

          // Send a POST request to the backend to generate a queue ticket
          return this.$http.post('http://localhost:3000/generate', {
            name: this.name,
            service: this.service,
            currentNumber: this.currentNumber[this.service]
          });

        })
        .then(response => {
          // Set the ticket number to the response from the backend
          this.ticketNumber = response.data.ticketNumber;
        })
        .catch(error => {
          console.log(error);
        });
    },
    printTicket() {
      // Print the ticket
      window.print();
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>