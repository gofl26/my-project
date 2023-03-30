<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="11" sm="8" md="4">
        <v-card>
          <v-tabs v-model="tab">
            <v-tab :key="1" @click="reset">로그인</v-tab>
            <v-tab :key="2" @click="reset">회원가입</v-tab>

            <v-tab-item :key="1">
              <v-card-text>
                <v-form @submit.prevent="submit">
                  <v-text-field
                    v-model="email"
                    :label="emailLabel"
                    type="email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :label="passwordLabel"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn type="submit" color="primary" class="mr-4">{{
                    buttonText
                  }}</v-btn>
                  <v-btn color="secondary" @click="reset">{{
                    resetText
                  }}</v-btn>
                </v-form>
              </v-card-text>
            </v-tab-item>

            <v-tab-item :key="2">
              <v-card-text>
                <v-form @submit.prevent="submit">
                  <v-text-field
                    v-model="email"
                    :label="emailLabel"
                    type="email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :label="passwordLabel"
                    type="password"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="passwordConfirm"
                    label="Password Confirm"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn type="submit" color="primary" class="mr-4">{{
                    buttonText
                  }}</v-btn>
                  <v-btn color="secondary" @click="reset">{{
                    resetText
                  }}</v-btn>
                </v-form>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <v-alert
      v-if="alert.show"
      :value="alert.show"
      :type="alert.type"
      dismissible
      @input="hideAlert"
    >
      {{ alert.message }}
    </v-alert>
  </v-container>
</template>

<script>

export default {
  async asyncData({ $pocketbase, redirect }) {
    if ($pocketbase.authStore.isValid) {
      return redirect('/')
    }
  },
  data() {
    return {
      pb: null,
      email: '',
      password: '',
      passwordConfirm: '',
      tab: 0,
      alert: {
        show: false,
        message: '',
        type: 'warning',
      },
    };
  },
  computed: {
    emailLabel() {
      return this.tab === 0 ? 'Email' : 'New Email'
    },
    passwordLabel() {
      return this.tab === 0 ? 'Password' : 'New Password'
    },
    buttonText() {
      return this.tab === 0 ? 'Login': 'Register'
    },
    resetText() {
      return this.tab === 0 ? 'Reset Password' : 'Back to Login'
    },
  },
  mounted() {
    if (this.$pocketbase.authStore.token) {
      console.info('1')
    } else {
      console.info('2')
    }
  },
  methods: {
    async submit() {
      if (this.tab) {
        //회원가입
        if (!this.email) {
          this.alert.show = true
          this.alert.type = 'warning',
          this.alert.message = '이메일을 입력해주세요.'
          return
        }
        if (!this.password || !this.passwordConfirm) {
          this.alert.show = true
          this.alert.type = 'warning',
          this.alert.message = '비밀번호를 입력해주세요.'
          return
        }
        if (this.password !== this.passwordConfirm) {
          this.alert.show = true
          this.alert.type = 'warning',
          this.alert.message = '비밀번호가 일치하지 않습니다.'
          return
        }
        const data = {
          email: this.email,
          emailVisibility: true,
          password: this.password,
          passwordConfirm: this.passwordConfirm,
        };
        try {
          const a = await this.$pocketbase.collection('users').create(data)
          console.info(a)
          this.alert.show = true
          this.alert.type = 'success'
          this.alert.message = '회원가입 성공'
          this.reset()
          return
        } catch(e) {
          this.alert.show = true
          this.alert.type = 'error'
          this.alert.message = '회원가입 실패'
          return
        }
      }

      try {
        const authData = await this.$pocketbase.collection('users').authWithPassword(
          this.email,
          this.password,
        )
        console.info(authData)
        console.log(this.$pocketbase.authStore.isValid);
        console.log(this.$pocketbase.authStore.token);
        console.log(this.$pocketbase.authStore.model.id);   
        this.$router.push('/content')
      } catch(e) {
        this.alert.show = true
        this.alert.type = 'error'
        this.alert.message = '로그인 실패'
      }
    },
    reset() {
      this.email = ''
      this.password = ''
      this.passwordConfirm = ''
      this.tab = 0
    },
    hideAlert() {
      this.alert.show = false
    },
  },
};
</script>