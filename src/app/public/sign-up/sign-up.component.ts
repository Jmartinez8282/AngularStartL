import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';


@Component({
  selector: 'pm-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

 
// signupForm = new FormGroup({
//   fName: new FormControl('', Validators.required),
//   lName: new FormControl('', [Validators.required, Validators.minLength(2)]),
//   mName: new FormControl('', Validators.required),
//   hasNoMiddleName: new FormControl(false),
//   password: new FormControl('')
// });

get firstName() {
  return this.signupForm.get('fName');
}

get favoriteProducts() {
  return this.signupForm.get('favoriteProducts') as FormArray;
}



signupForm = this.formBuilder.group({
  fName: ['', [Validators.required, this.forbiddenName]],
  lName: this.formBuilder.nonNullable.control("", {
    validators: [Validators.required, Validators.minLength(2)],
  }),
  mName: ['', Validators.required],
  hasNoMiddleName: [false],
  favoriteProducts: this.formBuilder.array([
    this.formBuilder.control('')
  ]),
  passwordGroup: this.formBuilder.group({
    password: "",
    confirmPassword: ""
  }, {validator: this.passwordMatch} as AbstractControlOptions),
});

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signupForm.get('hasNoMiddleName')?.valueChanges.subscribe(val => {
      const control = this.signupForm.get('mName');
      if(control) {
        if(val) {
          control.clearValidators();
        }else {
          control.setValidators(Validators.required);
        }
        control.updateValueAndValidity()
      }
    })
  }

  forbiddenName(c: AbstractControl): ValidationErrors | null {
    if (c.value && c.value.toLowerCase() === 'test') {
      return { 'forbiddenName': true};
    }
    return null;
  }
  	
passwordMatch(c: AbstractControl): ValidationErrors | null {
  const password = c.get('password');
  const confirmPassword = c.get('confirmPassword');

  if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
    return { 'mismatch': true};
  }
  return null;
}

  resetForm() {
    this.signupForm.reset();
  }

  addProduct() {
    this.favoriteProducts.push(this.formBuilder.control(''));
  }

  setValue() {
    this.signupForm.setValue({
      fName: 'Jose',
      lName: 'Martinez',
      mName: 'Luis',
      hasNoMiddleName: true,
      passwordGroup: {
        password: 'password',
        confirmPassword: 'password'
      },
      favoriteProducts: ['product1', 'product2']
    });
  }

  patchValue(){
    this.signupForm.patchValue({
      fName: 'Jose'
    });
  }
  submitForm() {
    if(this.signupForm.invalid) {
      alert('Fix errors on the form!')
    }else{
      alert('Succesfull')
      this.signupForm.reset();
    }
  }

}
