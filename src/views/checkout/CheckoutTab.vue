<script setup>
import BaseButton from '@/components/Base/BaseButton.vue'
import { computed, reactive, ref, nextTick } from 'vue'

/* ------------------------------------------------------------------ */
/* Program / pricing                                                   */
/* ------------------------------------------------------------------ */
const program = {
name: 'Course Name',
  fees: [
    { label: 'Registration Fee', amount: 100, dueNow: true },
    { label: 'Online Education Fees', amount: 385 },
    { label: 'Tuition', amount: 675 },
    { label: 'National Exam Fee', amount: 135 },
  ],
}

/* ------------------------------------------------------------------ */
/* Step 1: student information                                         */
/* ------------------------------------------------------------------ */
const sources = ['Search engine', 'Social media', 'Friend or family', 'Advertisement', 'Employer', 'Other']
const attestations = [
  { key: 'age', before: 'I attest that I am at least 18 years old.' },
  { key: 'edu', before: 'I attest that I have a high school diploma, GED, or equivalent.' },
  { key: 'eng', before: 'I am proficient in reading and writing the English language. ', links: ['View Policy'], after: '' },
  { key: 'terms', before: 'I have read the ', links: ['Enrollment Agreement', 'privacy policy'], after: ' and agree to the terms listed therein.' },
]

const form = reactive({
  email: '', first: '', last: '', phone: '', dob: '', source: null,
  checks: { age: false, edu: false, eng: false, terms: false, sms: false },
})

const formRef = ref(null)
const loading = ref(false)

const rules = {
  required: (v) => !!v || 'Required',
  email: (v) => /.+@.+\..+/.test(v) || 'Enter a valid email',
  phone: (v) => (v || '').replace(/\D/g, '').length >= 10 || 'Enter a valid phone number',
  birthdate: (v) => {
    if (!v) return 'Required'

    const dob = new Date(v)
    if (isNaN(dob.getTime())) return 'Invalid birthdate'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dob.setHours(0, 0, 0, 0)

    if (dob > today) return 'Birthdate cannot be in the future'

    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    if (age > 150) return 'Invalid birthdate'
    
    // Return true if valid, or the error string if invalid
    return age >= 18 || 'You must be at least 18 years old'
  },
}

const allChecked = computed(() => Object.values(form.checks).every(Boolean))

/* ------------------------------------------------------------------ */
/* Wizard                                                              */
/* ------------------------------------------------------------------ */
const step = ref(1) // 1 = student info, 2 = payment

async function goToStep(n) {
  step.value = n
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function submitStudent() {
  const { valid } = await formRef.value.validate()
  if (!valid || !allChecked.value) return
  loading.value = true
  // TODO: POST student info to your backend before moving on
  setTimeout(() => {
    loading.value = false
    goToStep(2)
  }, 300)
}

/* ------------------------------------------------------------------ */
/* Coupon + order summary (shared by both steps)                       */
/* ------------------------------------------------------------------ */
const coupon = ref('')
const couponError = ref('')
const discount = ref(0)

// Demo coupon codes — replace with an API call
const coupons = { SAVE50: 50 }
function applyCoupon() {
  const amt = coupons[coupon.value.trim().toUpperCase()]
  if (amt) { discount.value = amt; couponError.value = '' }
  else { discount.value = 0; couponError.value = 'Invalid coupon' }
}

const gross = program.fees.reduce((s, f) => s + f.amount, 0)
const baseDue = program.fees.filter((f) => f.dueNow).reduce((s, f) => s + f.amount, 0)

const total = computed(() => gross - discount.value)
const minDue = computed(() => Math.max(baseDue - discount.value, 0))

/* ------------------------------------------------------------------ */
/* Step 2: payment                                                     */
/* ------------------------------------------------------------------ */
const plan = ref('registration')
const customAmount = ref(baseDue)

const plans = computed(() => [
  { id: 'registration', title: 'Pay Registration:', amount: minDue.value, note: 'Non-refundable after cancellation period' },
  { id: 'full', title: 'Pay in Full:', amount: total.value, note: `$${baseDue} Non-refundable after cancellation period` },
  { id: 'custom', title: 'Pay Another Amount:', amount: null, note: `Minimum $${baseDue} registration fee` },
])

const dueToday = computed(() => {
  if (step.value === 1) return minDue.value
  if (plan.value === 'full') return total.value
  if (plan.value === 'custom') {
    const n = Number(customAmount.value)
    if (!Number.isFinite(n)) return minDue.value
    return Math.min(Math.max(n, minDue.value), total.value)
  }
  return minDue.value
})
const remaining = computed(() => total.value - dueToday.value)

const customRules = [
  (v) => Number(v) >= minDue.value || `Minimum is $${minDue.value}`,
  (v) => Number(v) <= total.value || `Maximum is $${total.value}`,
]

const cardType = ref('debit')
const card = reactive({ number: '', name: '', expiry: '', cvv: '' })
const billing = reactive({ address: '', apt: '', city: '', state: null, zip: '' })
const payFormRef = ref(null)
const paying = ref(false)
const snack = ref(false)

const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

function formatCardNumber() {
  card.number = card.number.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry() {
  const d = card.expiry.replace(/\D/g, '').slice(0, 4)
  card.expiry = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
function formatCvv() {
  card.cvv = card.cvv.replace(/\D/g, '').slice(0, 4)
}
function formatZip() {
  billing.zip = billing.zip.replace(/\D/g, '').slice(0, 5)
}

const cardRules = {
  number: (v) => (v || '').replace(/\D/g, '').length >= 13 || 'Enter a valid card number',
  expiry: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v || '') || 'Use mm/yy',
  cvv: (v) => /^\d{3,4}$/.test(v || '') || 'Enter CVV',
  zip: (v) => /^\d{5}$/.test(v || '') || 'Enter 5-digit ZIP',
}

async function pay() {
  const { valid } = await payFormRef.value.validate()
  if (!valid) return
  paying.value = true
  // TODO: tokenize the card with your payment processor (don't send raw card data to your own server),
  // then submit { student: form, plan: plan.value, amountToday: dueToday.value }.
  setTimeout(() => { paying.value = false; snack.value = true }, 600)
}
</script>

<template>
  <div class="page">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between py-4">
      <div class="brand"><v-icon icon="mdi-plus-circle-multiple" color="indigo-darken-3" /> yourbrand</div>
      <div class="d-flex align-center ga-6">
        <a class="top-link" href="tel:5550100"><v-icon icon="mdi-phone-outline" size="18" /> 555.010.0100</a>
        <a class="top-link" href="#">Student Portal</a>
      </div>
    </div>

    <div class="title mt-8 mb-6">
      {{ program.name }} <span>Student Registration</span>
    </div>

    <v-row>
      <!-- ============================ LEFT ============================ -->
      <v-col cols="12" md="7">
        <!-- STEP 1: student info -->
        <template v-if="step === 1">
          <h2 class="text-h6 font-weight-bold mb-3">Student Information</h2>
          <v-form ref="formRef" @submit.prevent="submitStudent">
            <v-row dense>
              <v-col cols="12" sm="7">
                <BaseTextField v-model="form.email" label="Email" type="email" variant="outlined"
                  :rules="[rules.required, rules.email]" />
              </v-col>
              <v-col cols="12" sm="5" class="text-caption pt-2">
                By entering your contact info, you agree to receive correspondence from us.
              </v-col>
            </v-row>
            <v-row dense class="mt-2">
              <v-col cols="12" sm="6">
              <BaseTextField v-model="form.first" label="First Name" variant="outlined" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" sm="6">
              <BaseTextField v-model="form.last" label="Last Name" variant="outlined" :rules="[rules.required]" />
              </v-col>
            </v-row>
            <v-row dense class="mt-2">
              <v-col cols="12" sm="6">
              <BaseTextField v-model="form.phone" label="Phone" type="tel" variant="outlined"
                :rules="[rules.required, rules.phone]" />
              </v-col>
              <v-col cols="12" sm="6">
              <BaseDateField v-model="form.dob" label="Date of Birth" variant="outlined"
                :rules="[rules.required, rules.birthdate]" max="yesterday" />
              </v-col>
            </v-row>
            <v-row dense class="mt-2">
              <v-col cols="12" sm="6">
              <BaseCombobox v-model="form.source" :options="sources" label="How did you hear about us?" variant="outlined" />
              </v-col>
            </v-row>

            <div class="mt-2">
              <BaseCheckbox
                v-for="a in attestations"
                :key="a.key"
                v-model="form.checks[a.key]"
                class="attest"
                density="compact"
                hide-details
              >
                <template #label>
                  <span>
                    {{ a.before }}
                    <template v-if="a.links">
                      <template v-for="(l, i) in a.links" :key="i">
                        <a href="#" @click.stop>{{ l }}</a>{{ i < a.links.length - 1 ? ', ' : '' }}
                      </template>
                    </template>
                    {{ a.after }}
                  </span>
                </template>
              </BaseCheckbox>
              <BaseCheckbox v-model="form.checks.sms" class="attest" density="compact" hide-details>
                <template #label>
                  <span>By enrolling in the {{ program.name }}, I agree to receive text messages regarding my enrollment, course and class information. Message &amp; data rates may apply. Message frequency varies. Carriers are not liable for delayed or undelivered messages. Reply HELP for assistance and STOP to cancel.</span>
                </template>
              </BaseCheckbox>
            </div>

            <div class="mt-6 continue-wrap">
              <v-btn type="submit" block class="continue-btn" :disabled="!allChecked" :loading="loading">
                Continue to Payment
              </v-btn>
            </div>
          </v-form>
        </template>

        <!-- STEP 2: payment -->
        <template v-else>
          <div class="plan-list mx-auto">
            <button
              v-for="p in plans"
              :key="p.id"
              type="button"
              class="plan"
              :class="{ 'plan--active': plan === p.id }"
              @click="plan = p.id"
            >
              <div class="d-flex justify-space-between align-baseline">
                <span class="plan-title">{{ p.title }}</span>
                <span v-if="p.amount !== null" class="plan-amount">$ {{ p.amount }}</span>
              </div>
              <div class="plan-note">{{ p.note }}</div>
            </button>

            <v-expand-transition>
              <BaseTextField
                v-if="plan === 'custom'"
                v-model="customAmount"
                label="Amount"
                prefix="$"
                type="number"
                :min="minDue"
                :max="total"
                :rules="customRules"
                class="mt-4"
                bg-color="white"
              />
            </v-expand-transition>
          </div>

          <v-form ref="payFormRef" @submit.prevent="pay">
            <h2 class="section-title mt-8">Card Information</h2>
            <v-radio-group v-model="cardType" inline hide-details class="mb-4">
              <v-radio label="Credit Card" value="credit" color="primary" />
              <v-radio label="Debit Card" value="debit" color="primary" />
            </v-radio-group>

            <v-row dense>
              <v-col cols="12" sm="6">
                <BaseTextField
                  v-model="card.number"
                  :label="cardType === 'credit' ? 'Credit Card Number' : 'Debit Card Number'"
                  autocomplete="cc-number"
                  inputmode="numeric"
                  :rules="[cardRules.number]"
                  variant="outlined"
                  @update:model-value="formatCardNumber"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseTextField v-model="card.name" label="Name on Card" autocomplete="cc-name" :rules="[rules.required]" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseTextField
                  v-model="card.expiry"
                  label="Expiration Date (mm/yy)"
                  autocomplete="cc-exp"
                  inputmode="numeric"
                  :rules="[cardRules.expiry]"
                  variant="outlined"
                  @update:model-value="formatExpiry"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseTextField
                  v-model="card.cvv"
                  label="CVV"
                  autocomplete="cc-csc"
                  inputmode="numeric"
                  :rules="[cardRules.cvv]"
                  variant="outlined"
                  @update:model-value="formatCvv"
                />
              </v-col>
            </v-row>

            <h2 class="section-title mt-6">Billing Address</h2>
            <v-row dense class="mt-1">
              <v-col cols="12" sm="6">
                <BaseTextField v-model="billing.address" variant="outlined" label="Address" autocomplete="address-line1" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseTextField v-model="billing.apt" variant="outlined" label="Apartment, Suite, etc." autocomplete="address-line2" />
              </v-col>
              <v-col cols="12" sm="6">
                <BaseTextField v-model="billing.city" variant="outlined" label="City" autocomplete="address-level2" :rules="[rules.required]" />
              </v-col>
              <v-col cols="6" sm="3">
                <BaseCombobox v-model="billing.state" variant="outlined" :options="states" label="State" :rules="[rules.required]" />
              </v-col>
              <v-col cols="6" sm="3">
                <BaseTextField
                  v-model="billing.zip"
                  label="ZIP Code"
                  autocomplete="postal-code"
                  inputmode="numeric"
                  :rules="[cardRules.zip]"
                   variant="outlined"
                  @update:model-value="formatZip"
                />
              </v-col>
            </v-row>
            <v-row class="d-flex align-center">
              <v-col cols="4">
                <BaseButton variant="secondary" prepend-icon="mdi-arrow-left" @click="goToStep(1)">
                  Back
                </BaseButton>
              </v-col>
              <v-col cols="8">
                <BaseButton type="submit" block class="continue-btn mt-4" :loading="paying">
                  Pay $ {{ dueToday }}
                </BaseButton>
              </v-col>
            </v-row>
          </v-form>
        </template>
      </v-col>

      <!-- ============================ RIGHT ============================ -->
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
              <BaseTextField
                v-model="coupon"
                label="Have a coupon?"
                hide-details
                variant="outlined"
                :error-messages="couponError"
              />
              <BaseButton variant="outlined" rounded="pill" color="indigo-lighten-3" :disabled="!coupon" @click="applyCoupon">Apply</BaseButton>
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

          <!-- Student info recap (step 2 only) -->
          <div v-if="step === 2" class="summary mt-4">
            <h3 class="text-h6 font-weight-bold mb-2">Student Information</h3>
            <div class="info-line"><strong>Name:</strong> {{ form.first }} {{ form.last }}</div>
            <div class="info-line"><strong>Phone:</strong> {{ form.phone }}</div>
            <div class="info-line"><strong>Email:</strong> {{ form.email }}</div>
            <div class="info-line"><strong>DOB:</strong> {{ form.dob }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>

  <v-snackbar v-model="snack" timeout="3000">Payment form valid (demo). Wire up your payment processor.</v-snackbar>
</template>

<style scoped>

/* Import the font specifically for this component */
@import url('https://fonts.googleapis.com/css2?family=Xmind:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');

.page {
  &,
  .text-h6,
  .text-caption,
  .text-body-2 {
    font-family: 'Xmind', sans-serif;
  }

  .mono {
    font-family: 'Source Code Pro', monospace;
  }
}


.page { max-width: 1200px; margin: 0 auto; padding: 0 24px 48px; background: #fff; color: #333; }
.brand { font-size: 28px; font-weight: 500; color: #1a237e; display: flex; align-items: center; gap: 8px; }
.top-link { color: #3949ab; font-weight: 700; text-decoration: none; font-size: 15px; }
.title { font-size: 20px; font-weight: 600; }
.title span { font-weight: 400; color: #666; }
.section-title { font-size: 1rem; font-weight: 600; }

.summary-wrap { background: #f4f4f4; padding: 16px; }
.summary { background: #fff; padding: 20px 12px; }
.program-name { color: #1a237e; font-weight: 700; font-size: 18px; line-height: 1.4; }
.fee-row { display: flex; justify-content: space-between; font-size: 14px; margin: 10px 0 10px 12px; }
.fee-row b { font-weight: 700; }
.mono { font-family: "Roboto Mono", monospace; }
.info-line { margin-top: 12px; font-size: 14px; }

.attest { font-size: 13px; color: #555; }
.attest :deep(.v-label) { font-size: 13px; opacity: 1; }
.continue-wrap { max-width: 434px; margin-left: 80px; }
.continue-btn { background: #1a237e !important; color: #fff !important; text-transform: none; letter-spacing: 1px; font-size: 18px; height: 44px !important; }

.plan-list { max-width: 300px; }
.plan {
  display: block; width: 100%; text-align: left; padding: 12px 16px; margin-bottom: 20px;
  border: 0; border-radius: 6px; background: #e0e7ff; color: #1a1a2e; cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25); transition: background 0.15s, transform 0.1s; font-family: inherit;
}
.plan:hover { transform: translateY(-1px); }
.plan:focus-visible { outline: 3px solid #3949ab; outline-offset: 2px; }
.plan--active { background: #1a237e; color: #fff; }
.plan-title, .plan-amount { font-size: 1.25rem; }
.plan-note { font-size: 0.75rem; line-height: 1.5; }

@media (max-width: 600px) {
  .continue-wrap { margin-left: 0; }
}
</style>