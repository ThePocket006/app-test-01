import { Component, Input, OnInit } from '@angular/core';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import VO from './vo/formDataVo';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { IData } from './sevice/api-service.service';


@Component({
  selector: 'app-app-starter',
  templateUrl: './app-starter.component.html',
  styleUrls: ['./app-starter.component.css']
})
export class AppStarterComponent implements OnInit {
  private Toast;

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
 
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.dots,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Terminer', class: 'btn btn-info', event: () => { this.onSubmit() } },
        // {
        //   text: 'Reset',
        //   class: 'btn btn-danger',
        //   event: () => {
        //     this.resetWizard();
        //   }
        // }
      ],
    }
  };

  configData = {
    times: [3, 6, 12],
    amounts: [5, 10, 50]
  }

  data:VO;

  @Input() stepForm: {
    step1: FormGroup,
    step2: FormGroup,
    step3: FormGroup
  };

  errors:any = {};
 
  constructor(
    private ngWizardService: NgWizardService,
    private route: ActivatedRoute
    ) {
      /**NOTE - Initialisation du model */
      this.data = new VO();

      /**NOTE - recuperation des donnees */
      this.data.setPlans(<IData>this.route.snapshot.data['data'])

      this.errors = {};

      /**NOTE - Creation des controls pour chaque etape */
      this.stepForm = {
        step1: new FormGroup({
          time: new FormControl(this.data.time, [
            Validators.required,
          ]),
          amount: new FormControl(this.data.amount, [
            Validators.required,
          ]),
          upform: new FormControl(this.data.upform, [
            Validators.required,
          ]),
        }),

        step2: new FormGroup({
          card_number: new FormControl(this.data.card.number, [
            Validators.required,
            Validators.minLength(13),
            Validators.maxLength(18),
            Validators.pattern("^[0-9]*$"),
          ]),
          card_cvc: new FormControl(this.data.card.cvc, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(3),
            Validators.pattern("^[0-9]*$"),
          ]),
          card_exp_month: new FormControl(this.data.card.exp_month, [
            Validators.required,
            Validators.maxLength(2),
            Validators.pattern("^[0-9]*$"),
          ]),
          card_exp_year: new FormControl(this.data.card.exp_year, [
            Validators.required,
            Validators.maxLength(4),
            Validators.pattern("^[0-9]*$"),
          ]),
        }),

        step3: new FormGroup({
          email: new FormControl(this.data.email, [
            Validators.required,
            Validators.email,
          ]),
          consent: new FormControl(this.data.consent, [
            Validators.required,
          ]),
        })
      };

      this.Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
  }
 
  ngOnInit() {
    //console.log('ngOnInit', this.stepForm)
  }

  onSubmit(){
    const args:StepValidationArgs = <StepValidationArgs>({
      fromStep: {
        index: 2
      }
    });

    //console.log('onSubmit', args);

    /**NOTE - On vérifie que toute les etapes sont valide avant d'effectuer la sauvegarde */
    if(this.stepValidator(args)){
      let timerInterval:any;
      Swal.fire({
        title: 'Simulation d\'un envoi!',
        html: 'Je fermerai dans <b></b> millisecondes.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b:any = Swal.getHtmlContainer()?.querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        // if (result.dismiss === Swal.DismissReason.timer) {
        //   //console.log('I was closed by the timer')
        // }
        this.Toast.fire({
          icon: 'success',
          title: 'Envoie reusie.'
        })
      })
    }
  }

  /**NOTE - function de validation des etapes */
  stepValidator(args: StepValidationArgs){
    //console.log('stepValidator', args);
    const fg = ((0 === args.fromStep.index) ? this.stepForm.step1 : ((1 === args.fromStep.index)? this.stepForm.step2 : this.stepForm.step3));

    this.errors = {};
    args.fromStep.state = STEP_STATE.normal;

    if(!fg.valid){
      args.fromStep.state = STEP_STATE.error;

      
      Object.keys(fg.controls).forEach(k => {
        this.errors[k] = {
          test: (fg.get(k)?.errors)?true:false,
          errors: fg.get(k)?.errors
        };
        //console.log('stepValidator:error', fg.get(k)?.errors);
        //console.log('stepValidator:error', this.errors);
      });
    }

    return fg.valid;
  }

  /**NOTE - just for test */
  getCurrentModel() { 
    return JSON.stringify(this.data); 
  }

  /**NOTE - recuperer l'erreur de validation du Form Control */
  getError(errors: ValidationErrors):string {
    //console.log('ERRORS::errors', errors)
    switch (true) {
      case _.has(errors, 'required'):
        return 'Ce champ de obligatoire.';
      case _.has(errors, 'minlength'):
        return `La longueur minimale requise est de ${_.get(errors, 'minlength.requiredLength')}`
      case _.has(errors, 'maxlength'):
        return `La longueur minimale requise est de ${_.get(errors, 'maxlength.requiredLength')}`
      case _.has(errors, 'pattern'):
        return `La valeur entrer doit respecter le model '${_.get(errors, 'pattern.requiredPattern')}'`
      default:
        return 'Erreur de format'
    }
  }
 
  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }
 
  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }
 
  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }
 
  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }
 
  stepChanged(args: StepChangedArgs) {
    //console.log(args.step);
  }
 
  isValidTypeBoolean: boolean = true;
}
