import * as _ from 'lodash';
import { ApiServiceService, IData } from '../sevice/api-service.service';


/**NOTE - Interface pour le model de donnee pour la souscription */
interface VOI {
    name: string;
    email: string;

    time: number,
    amount: number,
    upform: boolean,

    card: ICard
}

interface ICard {
    number: string;
    cvc: string;
    exp_month: number|null;
    exp_year: number|null;
}

/**NOTE - Interface pour le plan de souscription */
interface ISubPlan {
    duration_months: number;
    price_usd_per_gb: number;
}

/**NOTE - Class VO model de donnee pour la souscription */
class VO implements VOI {
    name: string;
    email: string;
    consent: boolean;

    time: number;
    amount: number;
    upform: boolean;
    card: ICard;

    /**NOTE - Liste des plans de souscription disponible */
    private plans: Array<ISubPlan> = [];
 
    constructor() {
        this.name = '';
        this.email = '';
        this.consent = false;

        this.time = 12;
        this.amount = 5;
        this.upform = false;

        this.card = <ICard>{
            number: '',
            cvc: '',
            exp_month: null,
            exp_year: null
        };

        // axios.get('/assets/data.json').then((apiResponse) => {
        //     //console.log(apiResponse);
        //     if(apiResponse.data?.subscription_plans){
        //         this.plans = apiResponse.data.subscription_plans;
        //     }
        // });
    }

    
    public setPlans(data: IData|ISubPlan[]) {
        this.plans = _.isArray(data) ? data : data.subscription_plans
    }
    

    /**NOTE - calcul de montant total */
    public getTotalBaseAmount(): number {
        const base:ISubPlan = this.getSubPlan();
        return this.amount * base.duration_months * base.price_usd_per_gb;
    }

    /**NOTE - calcul de montant total a payer */
    public getTotalAmount(): number {
        const amount = this.getTotalBaseAmount();

        return amount - this.getReductionAmount();
    }

    /**NOTE - calcul de la reduction si le paiement anticipe est a true */
    public getReductionAmount(): number {
        const amount = this.getTotalBaseAmount();

        return (amount * (this.upform === true ?10:0)/100);
    }

    /**NOTE - recuperation du plan de souscription du VO */
    public getSubPlan(): ISubPlan {
        let subPlan = this.plans.find((v) => { return v.duration_months === this.time });
        return <ISubPlan>((typeof subPlan === 'object') ? subPlan : {
            duration_months: 0,
            price_usd_per_gb: 0
        });
    }
}

export default VO;

export {
    VOI,
    VO,
    ICard,
    ISubPlan
}