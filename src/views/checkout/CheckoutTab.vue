<style>
  .page { max-width: 1200px; margin: 0 auto; padding: 0 24px 48px; background: #fff; color: #333; }
  .brand { font-size: 28px; font-weight: 500; color: #1a237e; display: flex; align-items: center; gap: 8px; }
  .top-link { color: #3949ab; font-weight: 700; text-decoration: none; font-size: 15px; }
  .title { font-size: 20px; font-weight: 600; }
  .title span { font-weight: 400; color: #666; }
  .summary-wrap { background: #f4f4f4; padding: 16px; }
  .summary { background: #fff; padding: 20px 12px; }
  .program-name { color: #1a237e; font-weight: 700; font-size: 18px; line-height: 1.4; }
  .fee-row { display: flex; justify-content: space-between; font-size: 14px; margin: 10px 0 10px 12px; }
  .fee-row b { font-weight: 700; }
  .mono { font-family: "Roboto Mono", monospace; }
  .attest { font-size: 13px; color: #555; }
  .attest .v-label { font-size: 13px; opacity: 1; }
  .continue-btn { background: #1a237e !important; color: #fff !important; text-transform: none; letter-spacing: 1px; font-size: 18px; height: 44px !important; }
</style>

<template>
  <div class="page">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between py-4">
      <div class="brand"><v-icon icon="mdi-plus-circle-multiple" color="indigo-darken-3"></v-icon> yourbrand</div>
      <div class="d-flex align-center ga-6">
        <a class="top-link" href="tel:5550100"><v-icon icon="mdi-phone-outline" size="18"></v-icon> 555.010.0100</a>
        <a class="top-link" href="#">Student Portal</a>
      </div>
    </div>

    <div class="title mt-8 mb-6">
      {{ program.name }} <span>Student Registration</span>
    </div>

    <v-row>
      <!-- Form -->
      <v-col cols="12" md="7">
        <h2 class="text-h6 font-weight-bold mb-3">Student Information</h2>
        <v-form ref="formRef" @submit.prevent="submit">
          <v-row dense>
            <v-col cols="12" sm="7">
              <BaseTextField v-model="form.email" label="Email" type="email" variant="outlined"
                :rules="[rules.required, rules.email]"></BaseTextField>
            </v-col>
            <v-col cols="12" sm="5" class="text-caption text-medium-emphasis pt-2">
              By entering your contact info, you agree to receive correspondence from us.
            </v-col>
          </v-row>
          <v-row dense class="mt-2">
            <v-col cols="12" sm="6">
              <BaseTextField v-model="form.first" label="First Name" variant="outlined" :rules="[rules.required]"></BaseTextField>
            </v-col>
            <v-col cols="12" sm="6">
              <BaseTextField v-model="form.last" label="Last Name" variant="outlined" :rules="[rules.required]"></BaseTextField>
            </v-col>
          </v-row>
          <v-row dense class="mt-2">
            <v-col cols="12" sm="6">
              <BaseTextField v-model="form.phone" label="Phone" type="tel" variant="outlined"
                :rules="[rules.required, rules.phone]"></BaseTextField>
            </v-col>
            <v-col cols="12" sm="6">
              <BaseDateField v-model="form.dob" label="Date of Birth" variant="outlined"
                :rules="[rules.required]"></BaseDateField>
            </v-col>
          </v-row>
          <v-row dense class="mt-2">
            <v-col cols="12" sm="6">
              <BaseCombobox v-model="form.source" :options="sources" label="How did you hear about us?" variant="outlined"></BaseCombobox>
            </v-col>
          </v-row>

          <div class="mt-2">
            <BaseCheckbox v-for="a in attestations" :key="a.key" v-model="form.checks[a.key]"
              class="attest" density="compact" hide-details>
              <template #label>
                <span>{{ a.before }}<a v-if="a.links" v-for="(l, i) in a.links" :key="i" href="#">{{ l }}{{ i < a.links.length - 1 ? ', ' : '' }}</a>{{ a.after }}</span>
              </template>
            </BaseCheckbox>
            <BaseCheckbox v-model="form.checks.sms" class="attest" density="compact" hide-details>
              <template #label>
                <span>By enrolling in the {{ program.name }}, I agree to receive text messages regarding my enrollment, course and class information. Message &amp; data rates may apply. Message frequency varies. Carriers are not liable for delayed or undelivered messages. Reply HELP for assistance and STOP to cancel.</span>
              </template>
            </BaseCheckbox>
          </div>

          <div class="mt-6" style="max-width: 434px; margin-left: 80px;">
            <v-btn type="submit" block class="continue-btn" :disabled="!allChecked" :loading="loading">
              Continue to Payment
            </v-btn>
          </div>
        </v-form>
      </v-col>

      <!-- Order summary -->
      <v-col cols="12" md="5">
        <div class="summary-wrap">
          <div class="summary">
            <h3 class="text-h6 font-weight-bold mb-4">Order Summary</h3>
            <div class="d-flex justify-space-between">
              <div class="program-name" style="max-width: 260px;">{{ program.name }}</div>
              <div class="mono font-weight-bold">$ {{ total }}</div>
            </div>
            <div class="mt-4">
              <div v-for="f in program.fees" :key="f.label" class="fee-row">
                <b>{{ f.label }}{{ f.dueNow ? '*' : '' }}:</b>
                <span class="mono">$ {{ f.amount }}</span>
              </div>
            </div>

            <div class="d-flex ga-4 mt-4 align-center">
              <BaseTextField v-model="coupon" label="Have a coupon?" variant="outlined" hide-details
                :error-messages="couponError"></BaseTextField>
              <v-btn variant="outlined" rounded="pill" color="indigo-lighten-3" :disabled="!coupon" @click="applyCoupon">Apply</v-btn>
            </div>
            <div v-if="discount" class="text-caption text-success mt-1">Coupon applied: -$ {{ discount }}</div>

            <div class="d-flex justify-space-between align-center mt-10">
              <span class="text-h6 font-weight-bold">Total Payment Today:</span>
              <span class="mono text-h6 text-indigo-darken-1">$ {{ dueToday }}</span>
            </div>
            <div class="d-flex justify-space-between mt-1">
              <span class="text-body-2">Remaining Balance:</span>
              <span class="mono text-body-2 text-red-darken-1">$ {{ remaining }}</span>
            </div>
            <div class="text-caption text-right mt-8">*Due at time of registration</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <v-snackbar v-model="snack" timeout="3000">Form valid. Proceeding to payment (demo).</v-snackbar>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const program = {
name: 'Course Name',
fees: [
  { label: 'Registration Fee', amount: 100, dueNow: true },
  { label: 'Online Education Fees', amount: 385 },
  { label: 'Tuition', amount: 2940 },
  { label: 'National Exam Fee', amount: 170 },
],
};
const sources = ['Search engine', 'Social media', 'Friend or family', 'Advertisement', 'Employer', 'Other'];
const attestations = [
  { key: 'age', before: 'I attest that I am at least 18 years old.' },
  { key: 'edu', before: 'I attest that I have a high school diploma, GED, or equivalent.' },
  { key: 'eng', before: 'I am proficient in reading and writing the English language. ', links: ['View Policy'], after: '' },
  { key: 'terms', before: 'I have read the ', links: ['Enrollment Agreement', 'privacy policy'], after: ' and agree to the terms listed therein.' },
];

const form = reactive({
  email: '', first: '', last: '', phone: '', dob: '', source: null,
  checks: { age: false, edu: false, eng: false, lic: false, terms: false, sms: false },
});

const formRef = ref(null);
const loading = ref(false);
const snack = ref(false);
const coupon = ref('');
const couponError = ref('');
const discount = ref(0);

const rules = {
  required: v => !!v || 'Required',
  email: v => /.+@.+\..+/.test(v) || 'Enter a valid email',
  phone: v => v.replace(/\D/g, '').length >= 10 || 'Enter a valid phone number',
};

const total = computed(() => program.fees.reduce((s, f) => s + f.amount, 0) - discount.value);
const baseDue = program.fees.filter(f => f.dueNow).reduce((s, f) => s + f.amount, 0);
const dueToday = computed(() => Math.max(baseDue - discount.value, 0));
const remaining = computed(() => total.value - dueToday.value);
const allChecked = computed(() => Object.values(form.checks).every(Boolean));

// Demo coupon codes — replace with an API call
const coupons = { SAVE50: 50 };
function applyCoupon() {
  const amt = coupons[coupon.value.trim().toUpperCase()];
  if (amt) { discount.value = amt; couponError.value = ''; }
  else { discount.value = 0; couponError.value = 'Invalid coupon'; }
}

async function submit() {
  const { valid } = await formRef.value.validate();
  if (!valid || !allChecked.value) return;
  loading.value = true;
  // TODO: POST form data to your backend, then redirect to payment
  setTimeout(() => { loading.value = false; snack.value = true; }, 600);
}

</script>
