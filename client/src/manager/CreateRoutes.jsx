import "../styles/CreateRoutes.css";
import Modal from "react-modal";
import RouteMap from "../components/RouteMap";
import CSVUpload from "../components/CSVUpload.jsx";
import { useState } from "react";
import {
  useOptimizeRoutesMutation,
  useGeocodeAddressMutation,
  useGoogleOptimizeRoutesMutation,
} from "./managersApiSlice";

// Test data for the depot and deliveries
import {
  depot as testDepot,
  deliveries as testDeliveries,
} from "./testData.js";

Modal.setAppElement("#root"); // Set the modal root element to the root div

const addDeliveryStyles = {
  // Styles for the Add Delivery modal
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxHeight: "90vh",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, 0)",
    scrollbarWidth: "thin",
  },
};

const viewRouteStyles = {
  // Styles for the View Route modal
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxHeight: "90vh",
    maxWidth: "90vw",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, 0)",
    scrollbarWidth: "thin",
  },
};

function CreateRoutes() {
  //* Quantum optimization
  // Use the optimizeRoutes and geocodeAddress mutations from the API slice
  // const [
  //   optimizeRoutes,
  //   { data: optimizeRoutesData, isLoading: optimizeRoutesIsLoading },
  // ] = useOptimizeRoutesMutation();

  //! test
  const [
    googleOptimizeRoutes,
    { data: optimizeRoutesData, isLoading: optimizeRoutesIsLoading },
  ] = useGoogleOptimizeRoutesMutation();
  const optimizeRoutesDataf = [
    {
      data: [
        {
          deliveries: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 37, 38,
          ],
          routes: [
            {
              routes: [
                {
                  distanceMeters: 310536,
                  duration: "29613s",
                  polyline: {
                    encodedPolyline:
                      "i|liGxpgcNUw@HMOq@m@h@]R`Mha@zAlF~C~IdAbDd@nBx@`E|AzEL~@?l@IfACLy@`By@dAg@tASdA@|@D\\r@fDHNpErRvApG|@|ERjB`@`Ct@|GnCpSPtA}Aj@}H`Ck@NUAiAVyDvA`CpIR`ATrA_Ct@r@tFh@nESRgEtA}CbAAG}FjBdBpMp@rFVxA^pDxAdKsC|@vH`l@eMvDm@NqDjA_Ct@_TrGgIrCGDSh@i@b@{An@aEnAb@bDBHl@jFf@pDg@V]d@Sn@Kz@Q\\URc_@tKc@Rs@j@q@j@_Af@IRsC|@ks@rST|BdAbIINcGfBmGfBWAQMM[w@}Ea@iCEIQAkNfE{PlF{@ZqB}N{BuQiCoT]{DwCwV}@oHiAcJg@eDMOWgB}BeReG_f@mGfBsJzCqB}OQ}ASa@wAwBc@cA]_B?M{E__@m@iFW}CYwDf@Qr@S`@SJUHi@?i@[eCAo@Hy@Rs@hHmMj@yA`@{AVmBbAyJ\\_BV{@l@mAt@{@z@o@p@YbASr@ChAH~@Xn@\\t@p@`CzCn@h@bAd@v@RtAJbAIv@WWcAQSgBSSQOc@AOLq@V]dAu@dBeAz@aAjCgFTs@Fw@@aBHe@R_@xAcB~CsCl@Wp@E|AH\\OZg@Lk@?WeKm}@a@eBm@iBS}@aDgXSs@_@_AQw@}NciAm@cEwD_ZCgADq@P{@B{@IoAaDeVyAiLOcA|f@ePrA_@yEq\\aDgUyBeQ}Ec]kBHgBJHh@pDfWdEsAv@vFjGwBtOuEP@PDh@IpPiFZWn@w@l@y@l@[d@MtCR^ITOt@bGj@vEVnAzA~EtCnJt@vB`AvBdA~AvLpNlJzKfAt@nKlEhCjAjEjBhClAV?pDvWbDeAhA~H\\fAf@v@tCbD`@x@Tv@nEp[fE`Z^rCVx@^h@rC~Bn@d@Zf@Nf@~Gdh@^vCfBpMjA`JbAvHPrA`AtGr@nF?XFvAAv@SlBeAjFKfAA~AFfCL`BXbCj@fCb@tAdArCXbAdB|E\\fB^nBN|AFpBC`Bg@zHEvCHxBVxBdBxKx@dGRfA`Hrf@HhACj@StAIlB@n@rBzNnBfOyPnFxPoFpDgAlMeE`Co@dJuCTBxIuCdGoBPGNQzCgBv@xCrC}Ah@_@LM^UVZNf@dA}@nAeBpAuBrIeMfHwLzJsS`GwO~AqGzAkJrAoLT}@K{A@I`BMx@YnCoBwCtB}@T]B{@nCGZyAnMuAjI_BpGaGvO{JrSgHvLsIdMqAtBoAdBeA|@Og@W[a@TKL_Al@}BnA|AxGsDtBgC|@oA`@fDxHF|@R`AdBtExBtFvA|El@jDXx@RPhAxHl@zEhA|KjFtk@NbDBbDUtNEdEDtD^lJl@hNNnGBbJBnELhD\\lDl@xDpYh_BZ`CT`DFpCCbCMzCWhCe@tCu@xCcV~t@sAbFgAhFcA~Fw@zFu@dHi@pHYpGSvJCvFJzGP|DZzEp@|Gv@`G`AnFpA|FfBtGhG~QvBxEf@`ANb@lFlKlEpK|AtCdErGzE`HnGzIx@vAt@zAz@|Bn@dCl@bDfWlcBrDvXbD~Wtc@rzDKj@lAnOj@tJlAtR^`IHhEClBKjAQlAg@bBm@nAs@bAiA`AmHfEmEtBm@TKNii@xQoRbGmTdGkPbEiZjH{LhD{NpEqVjIaR~Gwe@pR}K~DwQ|Fu\\hKaDbAk@Pc@KgIlB}Ah@kCbBgNjLwAz@yAn@mBd@qBRqB?qBQgCs@MEIIaMkE}Am@W@IDkEoBqEiBeA]qEqBuJuE{PuIaMcGiE_CeEoCgEgDsRmPaLsJ{KwJy@q@k@w@_F{Eeb@ec@aAuAcAiBk@oAy@oCk@oCqMm|@D]YaEOqEB}AFu@v@wFDgAIsAa@}D{@b@oCbA{N|DKIc@HsE~AWQIY?StDiOZoBRkCBcBEcCO_CyLm|@Ei@_BoK]eCI]WgBU{AGKYqB`Bk@X[|CuFPs@Dg@Ew@cD}T{BePvZmF\\WpB[TPlCOr@D\\Jd@X`@h@Vl@Lr@Dz@CzBMhCHX_@zDg@bEa@tCYb@k@jCo@~BoAnDg@lA{@bBy@pA]^g@^o@Rq@@m@Mm@_@a@g@c@{@Sq@OOy@eGg@qFo@gJSWSkEk@_OEmDAyDK]CeJMwBW}AuBiKcA_Hc@yCIKs@gHgCmWeAyIiEcYsVq_B}@uGyOimA}@mG{NeiAu@}Ek@mCmAuE}BkHyAoCeLgUoAoCm[ko@{EcJaZei@{AyBaBiByDcDmDwCiDsCkByBqAqB{JgQqBgEgj@icAuBoE_CaG_B}E_BcGkAyF}@mFqOamAeA}Jy@cKi@qJ[kJi@eYoDewBcEuaBg@kSQoPMkb@Iua@OiG[qGg@kGk@eF}Hoi@uAwJYeBH[kA{Jq@mFy@_FDc@aBiJoBsMiBuMJ_@_AaIQaC?cCLmA^kBrAcFLu@AgAG{@bJoCpKiDjCy@TQPQ~EyAdASp@KLNtFo@tAWVMFQzm@iQbh@cObB]LJF?~Dy@ZEdAYLOvLoD~sA}a@`Ce@|BcAjGoBdCy@WgBVfBsIpC}@V}BbA]HZ`DnAlIx@hGjAdHf@tDRbAx@jGrAdKJfAfA~HbAtHd@zCzCdUxBzPfCvQBf@bCxPtAhKDl@xAzJx@lF^hDFpAb@|HHzCCfDO~DqBpTeBzSOxBe@xFU~DIrF@vBL`Eh@lFVnBfAjHXnAnEjXvAlJ`@bB`@tCFn@x@nE`AxFGLGhAOd@Y\\SJe@@g@Im@a@e@q@Ma@Cg@Fk@P_@VUj@ONW~Dc@lDq@xDiAdDsAzDqBxA_A|N{K~@k@xAo@bBc@dBO`BAhBNlBd@~At@dAr@d@^jAnAtBtClHzKzAnBxAxApA|@|Ar@tBf@~OvBrBh@lAj@zAbArAtA`AxAz@`Bz@bCfCfJp@pBn@~AfApB`GrIfApBt@nBb@~A^fBXjCHxB@fCMdD_BjSInC@bCJ~BX`Ch@nCf@`Bl@xAz@|ArAjBjXv\\`C`CpB~AfC|AjB|@pC`ApCn@xDb@zIRpBRdB`@rE`BzFtB|AZtAJ~B?~O{@bEe@tHwAhDy@zBw@zBiAtBuAjDwCdHmGzAgAdB}@fBk@zLeC|XqFh@QfKqBhHsAvBq@pAk@lBoAjBaBjC}CbGkHxAaBdBgBfCqBfAq@vAc@nAOrA@rATjAb@jAv@r@t@l@z@j@fAlAjDt@nCh@zCL~CClB_@xLAlBJ|BTjB\\nB~EbTbBpJlDhXj@rEhDbWr@pF^`C\\zAt@dCbCtGzFnNn@hB`CzF`AdCxAfDbArDdArFhAxHl@zEhA|KjFtk@NbDBbDUtNEdEDtD^lJl@hNNnGBbJBnELhD\\lDl@xDxW`yAAp@RbC\\tG?jAKtBOpB@^_AtJOzA?d@U|JKl@Yx@sAjDiHfTu@lCq@|CkDbLo@rCaCzOc@`E}@nLIdBKJEt@@lB@t@IZQb@_D~@yB|@}t@fU{Cj@uFz@iZhJaDbAiNnE?|@tB`PuBaP?}@lNqEf_@kLpIsAzA_@ft@_UlCeAzDeAHADQVg@Ru@t@mHRi@zBqTHaBAeBKsCDqAPaA|CqJh@mBjAiFhA{DdGoQdAuBjCiD`@}@h@_B`@}Ad@eCZwCR{Bf@sIVoCV}B@sBCq@KTs@`@i@Lk@Ac@S[]Ug@Uw@OIsYa_Be@{DUoDIsDCiMKaFk@{Me@kLEsC@{DVcN?yCMoEiH_w@]eCFc@oA_Oc@aC_AoDs@yCGQMEo@gG_HnBiOzEk@`@KNSQg@Lya@lMYyBoBn@nBo@fCrRpKgDIc@a@kDPSjHmDnEuBfAg@NKVFnB_A`AtHnLuDl@QnA`KVhAHR]mAc@aDaCmRYyBuKfDk@XQNYl@YrBWj@[`@WRcBp@wMpGW?uF`CmObFqUxHyHjCoNpEUDq@UMG_@c@k@c@}@_@k@IY@cVvHg@b@Wb@Qh@Mz@GjBOZWVEDuGrBvGuBNH^AZP`ArAp@\\`@Jf@@zMsDh@[~B}A`Bm@h@a@p@oAPe@T}@Va@^WnPkFcAiI{@cIgDkWOiAl[aKxPoFpDgAhA_@_@aDcDuVc@cDAcARcCB_AK_As@cFuAgLcCkQa@qCWq@yG_M]aA[yASoBEuBVwHXaICsAQoAa@sAYm@iBwCeA}B[c@iA}Da@kBIg@McA@g@KuBBq@Nu@Xe@t@Ud@D^TPTPn@Bh@Cp@Qt@Yj@IJ?NeBxBeCjCmBxAyBjA{Aj@aCh@}MdCs\\vG}MlCuBn@uBdAmBtAyKvJuB|AwBhAyB|@eCn@kI`BaEh@wCTuMn@cB?aBOkBe@wK_EsBg@kBUsEOgDKqC[oCk@kC{@{BcA_CuAaCkBqBoB}Wi\\uAkBgAsBq@kBk@}B_@}BQwBGqB@eCRaEhAuQJoDCcCSwC]gCk@_Cw@yB_AiBuB_DiD_FkA{By@qBy@oC}BkIaAcC{@{AgAyAgAgA{AcA_Bq@{A_@{G_A_H_AgBe@}Au@_BmAaAcA{B}CuKePyAgByAkAmAq@aBk@yAWkAI_BBiBTaAV}An@gBlAiB`BqEnEkCvB_DtBmDfBkCdAmDbAgDn@qD`@yDNmW\\eFVwCR_Ix@}ZbEqDVwDJiQEmELwD`@sUbD{DXeENYF_Lb@sGj@{Fz@wGvAaKnCuDv@k]jF{@H[SeFJqMWo@Kk@[e@o@Yy@O_AEiCGaIKY{@aUAOSSQoPMkb@Iua@OiG[qGg@kGk@eF}Hoi@uAwJmJgn@mCaRmGad@sDmV{Faa@mFib@yG{l@iE}_@eKe~@wBiQsC_SaD}R_ByIoFuWyCyMmAuEuB{GaBuEeAiCqBoE@[eHwOmBwEsBcG_BwFkAaF]iBF_@_AeF_AaHs@mHqFws@aAiPaBqVgAqMmFmn@aIadA_AyO[gILu@?{FNyCPmBXoAb@kArC{ERy@Fu@A}@[kDcF`BmIzCuExBaDdB_@PMVcAh@cStHiEfB}DvAgAd@qA~@yErEeAx@_Ad@kAZiAJqAE_OyAuBAcBJoB`@kA`@wAt@wAfAyM|L}AlAs@^iEdBsDlAz@fB|GzLVLLCV@FAr@OLMBYGQMKQBu@`AKPM?SKoBkDcEsHe@cAtFoB|CqA\\Q|AmAxM}LhBsAtAq@jBk@vAUlBGrABxO|AtAArASbA_@^UdAy@jFeFrAy@jCaA~D{AzEsBvO}FbAi@V?jAc@R?`DmAn@Kn@@f@Nb@^X`@Nb@TvADdB@~E?lAHp@@zCF`CRzCz@pIRZlFvn@nDhe@x@hNp@`Mh@zGrAdNr@lHxAfPlItfAf@hHRTh@|D~@tFt@hDnCnJTHpB|FdBjEbBjD`HnNzAlD`BhE|BbHzApFdCpKvE`UpBhKzCrQlBdMpB|NvD`\\tNlpAz@hHJjAvGjj@rCfUzK`w@fCdQhBlM|AbKz@jGvHtg@p@tEf@vDTnBzKbv@p@bG^bFXfHNfHHrl@DvTJdKRfJS^BrEElBOtAmFhVKjA?bAFLHdAXlARd@j@t@n@d@v@TtAFjBExBUXHlD_AhMaEbCk@|Cc@|\\mF`EaA|IaCjGoAtG{@jGg@`J]\\G`HYnEg@|ScD`CUtEMpSBpCIrD[|WmDtSkBx]o@bCQrDg@jDw@`DeAvDaBdE}BtOoL~@k@xAo@bBc@dBO`BAhBNlBd@~At@dAr@d@^jAnAtBtClHzKzAnBxAxApA|@|Ar@tBf@~OvBrBh@lAj@zAbArAtA`AxAz@`Bz@bCfCfJp@pBn@~AfApB`GrIfApBt@nBb@~A^fBXjCHxB@fCMdD_BjSInC@bCJ~BX`Ch@nCf@`Bl@xAz@|ArAjBjXv\\`C`CpB~AfC|AjB|@pC`ApCn@xDb@zIRpBRdB`@rE`BzFtB|AZtAJ~B?~O{@bEe@tHwAhDy@zBw@zBiAtBuAjDwCdHmGzAgAdB}@fBk@zLeC|XqFh@QfKqBhHsAvBq@pAk@lBoAjBaBjC}CbGkHxAaBdBgBfCqBfAq@vAc@nAOrA@rATjAb@jAv@r@t@l@z@j@fAlAjDt@nCh@zCL~CClB_@xLAlBJ|BTjB\\nB~EbTbBpJlDhX`@jDEXrA|MfAdJd@tBnAjD`@rBj@lBhAtCjEvKrCpGnC~G\\fA~BlGj@dCi@T}Cn@{CbAfAdJyCcVYyBuKfDk@XQNKNSQg@LgUdHkCsSyH~Bc@La@PKN_@lBQXIDuEjAwA`@w@V{Cz@uBn@qA`@kBf@]J_@iD[sB{@oGlO}EbR_GtDkA_@aDq@iFj@Q`Bi@aAsHpJyCfGxd@XzBfB`Np@dFfBw@NKVFnB_AvBjPhDrWoC_TuAgKuAqKE}@Yl@YrBWj@[`@WRcBp@wMpGW?uF`CmObFqUxHyHjCoNpEUDq@UMG_@c@k@c@}@_@k@IY@cVvHg@b@Wb@Qh@Mz@GjBOZWVED{MbE{CcUiD~@_DdA`@dDvB`PlGoBzO_FNH^AZP`ArAp@\\`@J^@@b@vBrPh@tEPnAZl@n@dAlB|Np@rF`DnW`@`Eb@tD^jCbA|IvIkC~@UvNkEpFgBxGoBTKlBc@~Ak@~@Qd@UlA_@|F`f@|^sKbE~\\lS_GzBlRCRnBjPBHDBFd@|GkB}GjB|AjM}Cz@GNc@hDmAtHU`AoAvECXR|A{IfCcCp@{t@nSwBj@gj@nOon@lS{l@vRoPlFo@LkD~@uFhBmElAq@VyQlFaYtIiXdIuOzEk@T]Rs@t@i@\\oDh@wPzBIEaGt@wJtAoCd@KJgUfDyALiKwx@yYzIy@mGaHii@_HrBsAsJBOyC}U}A{JgA}HIIoAiJqAuKwJov@DW}BiQ_BuLOm@cFw`@u@{Fa@sCO}A[eCf@~DBb@r@hFfG|e@Br@bAjIjCnSDd@LNnL`_AxAjLN`AGHTtBD`@jCfPlB~Nn@~EFFfBzMdBrMEXpAnK]PqApBo@j@o@XqG|BKPog@rNg@EmD`@eCVa@JcBLs@Eg@Mk@]gDmDy@k@{@[q@Iw@Bw@Rm@Xk@f@q@dAYh@W`AQrAEvAF~AXvBf@tB\\dA^x@rAnBbDzDl@dAj@~An@|C`BrJVXhRjyAhGfa@xKvr@fIzi@zAnMdG`n@d@hGfHdqAtA~V~Ap\\l@nId@bEpIzl@xAzJb@hCfGta@h@~DE`@t@zG`@lFXrIV`Dd@~CnAjG?z@lAfHn@~E?x@Il@S`@WXc@Lm@Ac@Mw@i@g@k@Cs@Jc@FSbHyClEsAzAe@bAY`Cw@bLmE~FyBVUnPaGXArBs@PItTyHnFqBNOpSoHnQeGNDdDkAFQrc@aOfKoDHHlDkAPMDKdW}I`n@cTb_@mM|@]n[eKne@wOtYuJPBpFkBjBk@@SFM{BqPEkFDk@Pg@\\e@h@YvAnKhBzMsOlFELsn@zSof@~O{FjB_OfFsUdIeh@lQeW|IICc@FyCdAGP_TjH{ZdKSCcDhAEPs\\fLmHlCU?iH|BgE~AcHhCmGzB[VoP`GW@cFhBgC`AgDfAkDlAU?cAJ_@E[Ws@yAMUSMg@c@_CcBq@}@c@iAWeAw@wEOImIyj@aF{\\_DsTuAiKeDuVMy@q@aHuDwm@yCwi@SkEk@_OEmDAyDF]BeLGmDOwC[aDc@mCmB}HmAmEWyAgDg\\sAeKi\\awBuIsp@qFwb@e@cDsA{Ks@iFyEi_@_@yDo@wJ[oFa@cDe@gC_@_Bk@iBu@sBw@_BcF_JyLiVeAqBi@mAeOuZwBiEa@q@qHeO_D}FuV_d@sAuByB{C_BaBkKcJiBoBgBeC_G_KwAgBEg@{AgDkAsC{A{EeAcDe@_Ao@w@y@i@_AYc@Ek@?e@FcA\\w@l@c@j@a@v@c@vAgAdE[h@YXcA^KDAJuKjBiCb@gDd@yAZD\\bB]lDe@jIsA~B]rAYlAa@xH}CxBm@bB[hEk@Dg@Ck@]eCSi@_@gAKQ{@m@_CCk@Ms@_@i@m@y@oAK?m@gAW]aVmc@_C}EuBiFwAiEcBkGcAmEgAqGgBmMwH}l@u@}G{Dg`@i@kIi@yJKkDk@sa@_BcbAo@qn@Pc@DeLBOFgJL_B^kBvFyRVs@@S`AaB`AeAnA{@jBo@ZILU|Cc@|\\mF`EaA|IaCjGoAtG{@jGg@`J]\\G`HYnEg@|ScD`CUtEMpSBpCIrD[|WmDtSkBx]o@bCQrDg@jDw@`DeAvDaBdE}BtOoL~@k@xAo@bBc@dBO`BAhBNlBd@~At@dAr@d@^jAnAtBtClHzKzAnBxAxApA|@|Ar@tBf@~OvBrBh@lAj@zAbArAtA`AxAz@`Bz@bCfCfJp@pBn@~AfApB`GrIfApBt@nBb@~A^fBXjCHxB@fCMdD_BjSInC@bCJ~BX`Ch@nCf@`Bl@xAz@|ArAjBjXv\\`C`CpB~AfC|AjB|@pC`ApCn@xDb@zIRpBRdB`@rE`BzFtB|AZtAJ~B?~O{@bEe@tHwAhDy@zBw@zBiAtBuAjDwCdHmGzAgAdB}@fBk@zLeC|XqFh@QfKqBhHsAvBq@pAk@lBoAjBaBjC}CbGkHxAaBdBgBfCqBfAq@vAc@nAOrA@rATjAb@jAv@r@t@l@z@j@fAlAjDt@nCh@zCL~CClB_@xLAlBJ|BTjB\\nB~EbTbBpJlDhX`@jDEXrA|MfAdJJ`Ad@`Dd@hCjApFFZkGpBWT{C`AWWgHaRcDbAr@tF",
                  },
                  routeToken:
                    "CoQaCpcZMpQZGnQKIQIWCTronzhFgAjdEeoF-A_exrUE0ZvOBIrnBdGVA840ABIgCvbNJkPFSAnBLYFtEiGR_7uJ8OS9BPd5H3wDPGfEPNIaDQAGA6EBBRMS_____w8qCBN2Wx5WH2F3MgECPTzZKj9FJCJfP0j-pe7gsaDdNhp9CiUCFgpAHPwRRYAI1lHbnQT-pg_NqSGOwCSJkkbgikL7gVjI9U0AEihnxDzSwb9hyGjjOejU08Q7cO-HMQwifbzjAEUBKlpdQrB2bQq8BijiGgoAEjMWFRMoPR1bKgpUGFwdYh1cFlsQPSQiXz9F-nZOP0j4ufqp-P2G6DMapwEKOwIWD17xzYjvKgihgQar5Azhp6YEsqOwBKmvggH63YUByLs87_Y27wakApnllxCur_oF5fLBAaq2jwEAEjC8BijiJ17NGU9CKl0N8mc-7R57Zv_t3Ws-ey-7lAhpnTYRNSp1HAjUC13bvTeWf_8aDgBbBRspEOgCAO8DKwkTKgxzah1bGxxddHVbX1kyAwUBAT36dk4_RWXZ5T5Ir4qByc-NhunsARqDAQoqAhYKQC7k7USACLbrCcXfA-yrHt7wpQHd-Gv9ngj6-s4FgcSfAfHhvgEAEig3ln__Yu3CPAOehL7yIs0OhKUL4IyTR6_MTcQoinWDuo0OZFc-ROcWGgoAXRclWxYfcEUAKgpUBl8dClsUdxwAPWXZ5T5F2kYGP0ivw4ej34GkmPwBGlsKGgIWBiiFURBFgAj00k6_rmHQpzjR4wa_0ikAEhg_ROcWE7E0p7GAVJ1fdgFnyxBl47yy5ZsaBgAQBzAZAioGNhtddRN3PU1y8z5FXFU8P0i5muPqxYmckYMBGrMBCj0CFg9e3GBhRYAIm8UB_5a0AfSwtQG_mgHEqAGK7KlZ5cSsWdKjCovQ-gnErI8RnqGeDMfdJIjuAc2DrAEAEji9suWb9xsk12-TmF0qTaiLWvhkBv2h1JFoGuha5leZ4NwfZVGaUtH1Wgad06VYppRiJtWntsVnBxoRAAZsDU4C_QQA-AGEBR0DAkQqDm9uYxpbdwAAAxFTAQ51MgEGPUhVhz5FV-IEP0jkk7bI0vql7BMahwEKKwIWCkC31WvsKgjFU82TIualMr-EJ8WxmQHZrMqLAtKexosCrqoklNiFCQASKLbFZwde4s9Z2MfFw6tTv70ApPGTXNEdTpgMjQfMmVltWjSnn_j8zssaDQAQfwaYAb8E0gQIFj0qChgcGQELDAIBFlk9V-IEP0URXq4-SKupiIDqzOiz5QEajQEKMAIWC0bjTyRGgAjWFLPJBKbF3xHojtUYseblC_LFlBe1zbwWt46nAa3q0AHg4qACABIo-fzOy64Z6QOOnFxWRpf_TdQ9GqxHWrNdqYQgAXQ-mOHBrTrPFaCS9RoMAAQOapERxgIBHUIAKgpUHF0GbAEEcWF3MgEEPfjQKD9FaG5GP0jfx4bdgMrS30AafgooAhYKQIJRE-8qCL2mCJTosAa3lrgGmxGJv-kFyoXIBffRPJDxHZIoABIkFKCS9bGrLBMc1BFieCSWPf_whv6qODoLVSiy6eldx3TKgL4kGgoAB-4DCQF4KBwYKgkYHWhNAgFdHW8yAQg9YEZmPkUAAIA_SLH-pu6K4c6QFRphChoCFgcuQjW77yoI3AMK8qYI3NoI3aABnIoBABIYy4C-JOCVvRu80lG44zVK6mgl9jsbGPGLGgoABBYOBf____8PKgY2HFtaFAAyAQA9AAAAAEUOa88-SPros4-vhuahURpXChoCFgYorh--7yoI5M4Bq-ICpJUDt4YJ1fcCABIUGxjxi-7OC3E488inCeuQAU3ObgIaBQAEMgsBKgU0d2IdcjIBBD0Oa88-RfClST9I6ubD8tbsuok-GlcKGQIWBiih7L3vKgjZEfXSCdvfCpupfMSMfQASFEzObgKD0bxSeY2qSCJ_zXMgO5qJGgUAFgNkDyoFElxqYQQyAQA9QWhZPkUiEGs_SJ7YqMmWr6u2iwEaYwoaAhYGKKqTpu8qCJT8E-_NBZP0BK3xIY7SGwASGCE7mokQoMXqn3MikM6DcuqrgdI4P0TnFhoOAEIK_v___w8X_____w8qBjdsXAEdAD3vfqc9RU1y8z5IjsTTys-f4LHSARqZAQo0AhYMTIVREEWACJyZB_n8xgTH9YUj8rDJI7HzCP33yUO21YATlqHSEJvnCu-2hQPct7kCABIwP0TnFpV0dBf6AddHQLk6KdbeOFisnANxipMvejJ-ZXiOCTFvkAamMHGI-HcRmH3KGg0ADU3QEQBjWCkaBUoJKgw2WwN1AQtxBW1nVGY9TXLzPkW4cB4_SLKP2teGmIiMPBqoAQo7AhYOWEDFW0iACN2jCfjApAKzmZERvc7EEO7y-0PVovxD0oivKL3dhimq5bwBrdCeAdaOJd29OYLsAQASMBGYfcoAPPuqJyMPR79Uu26IpX-UesCcdtQ9GqzAGcyQYDr19zIoJ9cJ65ABTc5uAhoQAKgBQJ4BfATOEeQBARMLACoMOSV3dwYCbQV0Ilp3MgIDAz24cB4_Rft6wT5I56nXu6_33O3YARpVChcCFgUiL0G_7yoI3YIL5-Yl4NEam84IABIUTM5uAoPRvFJaJQXWQLvm4ZoXVT4aCQAUFQ7_____DyoFGFsdWgA9gkIfP0XlRRE_SM7_h9_1oevWSxpTChcCFgUitLW77yoI7-0H7O0HjYsIupkGABIQmhdVPkU9yT7jD6ZQP0TnFhoIABwl_____w8qBHMhGgAyAQE95UURP0WYMUQ_SLHUp5nC5dzP-gEaNwoOAhYCEM9REEWACPDeBAASCD9E5xYIf-0gGgIAACoCNgE9mDFEP0X0Bws_SO-y1tSen_vYvgEaPgoPAhYDFmM1EUWACMQ2_X8AEgwIf-0glXR0F9aDA9gaAwAMFioDN10aPfQHCz9FKJslP0jFnZy03s3H_PUBGmIKGwIWBy4lyxFFgAjkGdVh_ukByocrrYYu6tshABIc1oMD2IwsXyCQ-S5YWRVsNOIh7TfuzgtxcxU_bxoHABEFHRkEKyoHNmEeG1l2Aj0omyU_RaI8Bz9IpLzZ9tvc7PC1ARppCh4CFgcuATG97yoI8b4jsuojv_CoAuyKfNiEC86HCgASHHIVP2-HUO3beY2qSCJ_zXMD7DsLGiLwMkIbjywaCwAH_____w9kLB04KgcZUXRhHl1iPbyG8T5FO985P0i6gOqtwr3L35kBGooBCisCFgtGyemj7yoIrvsCiJ4NnrugAYCnqQGH7jjgviOTsySE4wuvjyGZmCAAEixCG48s8yQsxX3mDAcaOnTVMxFpghXcz232JG6x1GYtY4wZXky_CE3gUhhhNBoLABkpZQUvGAU6CQIqC1VcH1weXB5bG1oAPTvfOT9Ft9qWPki7rJu984PfxpoBGosBCi8CFgxMJffA7yoIr8UBnsoBz6QJpJ0Lw8SWDqDElg7tjyz7uSrwxSnS1iPVx8IFABIoUxhhNIg-2Rp6YNRU7aNN5iakrUJtu_CDUx1HI3bLpHT81EjnXikBahoKACYJLSQZCxgJBioKc18cEB5aHVocATICAwE9pJI0P0XVoi8_SIyNuY-IiIKHPBqxAQo9AhYQZBwWtO4qCM6L5gWh9eQF980d8MYcydUE5tMFsvMIlqu-F_W6sxfZ7AmAnrsO56-yDpUE0dwI7qwgABI0XykBalD-Z7N4Apa4lTIOhQBi1jd5qRBGaOqgfR6vkJOz_tOTSGa8JckH8uR8weYylOGJIhoSABYN_____w8iMjoEyQEhAlwBKg1VHAMAZ2oABDBpcDYBMgMBAwU9V7qgPkXEEQQ_SIK8_cL05snifRpgCh0CFgYo6-pp7SoIxtoCm4GNDpTnrlTS6txYq4EZABIYlOGJIrFZJ0tkXbqFtoLrcULFWwN6ecWzGggAGQqMAwDSASoGVRsDcwF2PcQRBD9FlJtDP0jAiJvD2v2JkM8BGsABCj4CFhFq5Jjd6yoIs5ABjJIBuPQW77cWuQaN1YITpsaAE4I0xof9IuH79CKq5bwBvdeeAbGrAcXwIObACZo5ABI8ennFs0XneZ7oI-BEQ713mihE0RxfZse6HevliIJqKjLUPRqswBnMkDU2bgwa0cH3lp5PjR98AzxnxDzSGhcABgQHAQH5AQG3EuQBAKQBCRL_____DyoPdFluYnV3BgBuBQAgYV93MgIHAT2Um0M_RSQiXz9I8az5uYTDgsNrIhdqSi1lWjVHMUk2V2EzZkVQeWNDTDZBURAFGk8KTQoYCg0KAggBEQAAAAAAgGZAEYGVQ4uQiuxAEhIIABADEAYQExASGAJCBBoCCAUiGwoXakotZVo0X3lIYVdhM2ZFUHljQ0w2QVFwASgBIhUASEgXO3fQfL94HP3_juOqVWCdH6oaGAoKDUDfBBoVz1C10BIKDSzdBBoVoFK10A",
                },
              ],
            },
            {
              routes: [
                {
                  distanceMeters: 52627,
                  duration: "8853s",
                  polyline: {
                    encodedPolyline:
                      "eeliG|~mcNh@nESRgEtA}CbAsCkTc@cDAcARcCB_AK_As@cFuAgLcCkQa@qCWq@yG_M]aA[yASoBEuBVwHXaICsAQoAa@sAYm@iBwCeA}B[c@iA}Da@kBIg@McA@g@KuBBq@Nu@Xe@t@Ud@D^TPTPn@Bh@Cp@Qt@Yj@IJ?NeBxBeCjCmBxAyBjA{Aj@aCh@}MdCs\\vG}MlCuBn@uBdAmBtAyKvJuB|AwBhAyB|@eCn@kI`BaEh@wCTuMn@cB?aBOkBe@wK_EsBg@kBUsEOgDKqC[oCk@kC{@{BcA_CuAaCkBqBoB}Wi\\uAkBgAsBq@kBk@}B_@}BQwBGqB@eCRaEhAuQJoDCcCSwC]gCk@_Cw@yB_AiBuB_DiD_FkA{By@qBy@oC}BkIaAcC{@{AgAyAgAgA{AcA_Bq@{A_@{G_A_H_AgBe@}Au@_BmAaAcA{B}CuKePyAgByAkAmAq@aBk@yAWkAI_BBiBTaAV}An@gBlAiB`BqEnEkCvB_DtBmDfBkCdAmDbAgDn@qD`@yDNmW\\eFVwCR_Ix@}ZbEqDVwDJiQEmELwD`@sUbD{DXeENYF_Lb@sGj@{Fz@wGvAaKnCuDv@k]jF{@H[SeFJqAAOLcGB_CLsKpAk@Ca@SYa@Mm@Ak@Fq@Pg@\\]^Kd@B`@TXd@Px@b@hJPVvBtt@z@tXv@rYxB`rAH`KXbLfAdWZbEt@rGbC`QNp@nLb~@bAzFlAtF`BhGnB~F`BdEdChF`PdZB\\lC|Fh@zA\\fBVrBVxC@\\LzAA`AIl@O`@o@t@MNaDhAYDkKfBWFkBXwB\\aALyAZoCb@Y?oEx@g@FiKbBqDj@}Bd@oDf@yV|DB^z@MdWaEbDg@rF_A`@ClGiAvDk@zCk@|@I`Dk@pAShC_@jIsA~B]rAYlAa@xH}CxBm@bB[zEm@zCKhFFhBKDIfDg@|N}BzG_ANHxG{@nASlGu@jD]vMgBfAS^CvKiBJK~HeAJ@rN{Bb^cGtBYrFiA~d@qFpb@sFvOmBzMiBbDi@jGu@fOgBz[}DzJiAxG}@|a@iFjb@qM`@IxE{A`M}DzDeAl^}KhQqF|AdMPvApJ{CrGsBzOqFvLwDjGmBzAIfD_A|PqF|IoCrA]xBs@bFwAl@SxBo@|Cu@XYR_ANw@NQzFcBtJ{CfGmB`@`DfB`NBNs[zJYyBoBn@nBo@tLn~@qA_KfDrWhA~JhA|IzC|V_ATeBf@qBqP{@mHyDhAqAiKKk@cEpAk@@a@OKQO}@MeAtMaEnA[^Kp@QhA~JhA|IJEKDqBcPk@aF}Eq_@KHy@Xx@YJIaBgM|Grh@j@lEhA~JhA|IR~ADb@@BkAmJaA}Ha@yDzLuDlEuAtIkC|Bo@pHyBnR}Fg@_Co@wCuBoTcAmILO@Qo@eFi@sCmAqEuA}CMGyFiNK[@_@{AcF{AsDkDsI_A{Cq@}Ce@mCi@kEi@_Gg@cE?_@i@yEKg@gCuRgA}EeBiKk@uCQa@gAoEeCiKSeAUgAOuBAcB@[Lc@Ra@rAsBTk@H]Hm@BaAGgAMy@wBwG[aBGcAw@oCiBwFwBeG}BaH_AqCcCyIOm@oDkLl@i@Np@ILTv@",
                  },
                  routeToken:
                    "CvwJCo8JMowJGnwKJwIWCToc_BFFgAjWUY35yATTz64i8rHJI-bY_hHFm-cRs5RWjNVbABIkZ8Q80sG_Ycj6AddHQLk6KbQcY0DgCEpsHknmrp3gauhNYpqnGgwAEogC0BEB3QYFUAYqCVQYBXUBbgRbdD0kIl8_RQ_qzz5I3P6ZqOzc-Y9xGjgKDwIWAhBLXdjrKgjM2JkLABIITWKapzN-fiAaAgAOKgI5AD0P6s8-RQAAgD9I4P28mO7Ah8G-ARpSChsCFgUidLLk7ioIwJX6AqeJxwOczoEDs4quAgASEJBv5x_Lc0oX82FCOhUHIzcaBAAgFRkqBDkdXAEyAQM9AAAAAEUAAIA_SIqSm9ietvyFWhpXChkCFgYoCwEURYAI2JEBg-UI7ZAS-K4GkigAEhRCiWwqjKZzSGpbW3rpXcd0yoC-JBoFAAgiFRgqBTYdGx1vMgEEPQAAAABFAACAP0id2J-ahNrq_ewBGkIKEQIWBBxCNbvvKgjcAwqajy4AEgzLgL4k4JW9G73TKesaAwAEASoDNhwBMgEAPQAAAABFhJSePkjQ45_dsoW-0EgaNwoOAhYCEP0vtu8qCP2bAgASCLzTKeuGI36hGgIAACoCGQE9vrUwP0W4WCw_SJq_yuK-35yg2AEaNwoPAhYCEHejtu8qCIKnhAEAEgiHI36hUkxw_BoCACUqAlUePY9Opz5FPj0kP0iDw6b-rYDDmnIaWgoZAhYGKJXwnu8qCJcL7aIKlt8IzJIC7qEBABIYUkxw_LMuvI-M2oWM1q8V7sqbnEPgtJJyGgcACA4aCd8CKgZzHFsZWQg9Pj0kP0Xm2hM_SJ-6o6nHy8vLExo_ChACFgMWrRO27yoIwhi-9QIAEgzgtJJyyq33jJQY9TEaAwATByoDNwxbPebaEz9Fcd8rPkj0vIjwqqf514wBGkQKEgIWBBz0a7TvKgjxBLoSobcsABIMlRj1MfP3-zPgJu0oGgMABioqA3MGWjIBAT0kCFU_RSwXTz9I4LnKkfCC7cT-ARpJChMCFgQcEFe57yoI2BP1owL64AIAEgzhJu0oUM4Yl2PrjbIaBwAQ_____w8qAzZlADIBAj1Ro0M-RSkWRj9I-9rqrPnV1tOEARo8ChECFgMWANS57yoIwgSSroQBABIIYuuNssM6qQoaAgAAKgJUADIBAD1cp2c-RRhk2T1Ivrjz_c3OodFyGjUKDQIWAhAmbLTvKgi-AQASCMM6qQrDOqkKGgIAACoCVQE9GGTZPUXdvxs_SIn2sqXituHtcBo0CgwCFgIQs2a07yoIAgASCMM6qQrDOqkKGgIAACoCVXE93b8bP0W5OSw_SJ3OmMfu_aTiJhp9CicCFgpAsWa07yoIgYQL0oZBje1DutML_a4LoawIjd-zAbqo4AS3EQASJMI6qQr7x29M1nk3I6NOwvOkC3ir4sUbpDRaPTlCxUgJC_bNJhoJAAkLBwsIZgoGKgkZHlcFAAMZGXMyAQM9j4ynPkWITao-SIOY5Zr11bXShwEiF2pKLWVaXzZaT2JYcnZPTVB0TnVfLUFZEAUaTwpNChgKDQoCCAERAAAAAACAZkARw_UoXM9VzUASEggAEAMQBhATEBIYAkIEGgIIBSIbChdqSi1lWl9fd05yWHJ2T01QdE51Xy1BWXABKAEiFQBISBc7XjyyHKG0ScotdU7Fm0g_4xoYCgoNlE4EGhU7SLDQEgoNkk0EGhWoSLDQ",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const [geocodeAddress] = useGeocodeAddressMutation();
  //! test

  // Initialize state variables
  const [deliveries, setDeliveries] = useState(testDeliveries); // Initialized with test data
  const [numVehicles, setNumVehicles] = useState(2);
  const [depot, setDepot] = useState(testDepot); // Initialized with test data
  const [modalAddDeliveryIsOpen, setModalAddDeliveryIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [modalViewRouteIsOpen, setModalViewRouteIsOpen] = useState(false);

  function setModalAddDeliveryOpen() {
    setModalAddDeliveryIsOpen(true);
  }

  function setModalAddDeliveryClose() {
    setModalAddDeliveryIsOpen(false);
  }

  function setModalViewRouteOpen(route) {
    setSelectedRoute(route);
    setModalViewRouteIsOpen(true);
  }

  function setModalViewRouteClose() {
    setSelectedRoute(null);
    setModalViewRouteIsOpen(false);
  }

  async function geocodeDeliveryAddress(
    streetnumber,
    streetname,
    postalcode,
    city,
    province,
    demand
  ) {
    // Validation flags
    let errors = [];

    // Validate street number (numeric and not empty)
    if (!streetnumber || !/^\d+$/.test(streetnumber)) {
      errors.push("Street number must be a valid number.");
    }

    // Validate street name (letters, spaces, and hyphens allowed)
    if (!streetname || !/^[a-zA-Z\s-]+$/.test(streetname)) {
      errors.push("Street name must contain only letters, spaces, or hyphens.");
    }

    // Validate postal code (Canadian postal code format: A1A 1A1)
    if (!postalcode || !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalcode)) {
      errors.push("Postal code must be in the format A1A 1A1.");
    }

    // Validate city (letters and spaces only)
    if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
      errors.push("City must contain only letters and spaces.");
    }

    // Validate province (two-letter codes, e.g., ON, BC, etc.)
    const validProvinces = [
      "AB",
      "BC",
      "MB",
      "NB",
      "NL",
      "NS",
      "NT",
      "NU",
      "ON",
      "PE",
      "QC",
      "SK",
      "YT",
    ];
    if (!province || !validProvinces.includes(province.toUpperCase())) {
      errors.push("Province must be a valid two-letter code (e.g., ON, BC).");
    }

    // If validation errors exist, show alerts and return
    if (errors.length > 0) {
      // alert(errors.join("\n"));
      throw new Error("bing");
    }

    // Concatenate validated address
    let address = `${streetnumber} ${streetname}, ${city}, ${province}, ${postalcode}`;

    // Get geocode data for the address
    try {
      const response = await geocodeAddress({ address }); // Call the geocodeAddress mutation
      const result = response.data.results[0]; // Get the first result
      return { ...result, demand: demand }; // Return the geocode data with the demand value
    } catch (error) {
      console.error(error);
    }
  }

  // Handle adding a delivery
  async function handleAddDelivery(e) {
    e.preventDefault();

    // Get form values
    const streetnumber = e.target.elements.streetnumber.value.trim();
    const streetname = e.target.elements.streetname.value.trim();
    const postalcode = e.target.elements.postalcode.value.trim();
    const city = e.target.elements.city.value.trim();
    const province = e.target.elements.province.value.trim();
    const demand = e.target.elements.demand.value.trim();

    try {
      const result = await geocodeDeliveryAddress(
        streetnumber,
        streetname,
        postalcode,
        city,
        province,
        demand
      );
      setDeliveries([...deliveries, result]);
    } catch (error) {
      console.error(error);
    }

    setModalAddDeliveryClose();
  }

  function handleNumVehiclesChange(e) {
    setNumVehicles(e.target.value);
  }

  function handleDepotChange(e) {
    setDepot(e.target.value);
  }

  // Handle optimization
  async function handleOptimization(e) {
    e.preventDefault();

    // Call the optimizeRoutes mutation
    try {
      //* quantum
      // await optimizeRoutes({
      //   depot,
      //   deliveries,
      //   numVehicles,
      // });
      await googleOptimizeRoutes({
        depot,
        deliveries,
        numVehicles,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="page-frame">
        <h1>Create Routes</h1>
        <hr />
        {/* Deliveries Section */}
        <div className="page-section create-routes-deliveries">
          <h2>Deliveries</h2>
          {/* Map and display the added deliveries */}
          <ul>
            {deliveries.map((delivery, index) => (
              <li key={index}>
                {`${delivery.formatted_address} (Demand: ${delivery.demand})`}
                <button
                  onClick={() =>
                    setDeliveries(deliveries.filter((_, i) => i !== index))
                  }
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
          {/* Button to add open the new delivery modal */}
          <button className="btn btn-primary" onClick={setModalAddDeliveryOpen}>
            Add Delivery
          </button>
          <CSVUpload
            setDeliveries={setDeliveries}
            geocodeDeliveryAddress={geocodeDeliveryAddress}
          />
        </div>
        <hr />
        {/* Optimize Routes Section */}
        <div className="page-section create-routes-optimizations">
          <h2>Optimize Routes</h2>
          {/* Form to input the number of vehicles and depot */}
          <form className="form" onSubmit={handleOptimization}>
            <label htmlFor="numVehicles">Max Number of Vehicles:</label>
            <input
              type="number"
              id="numVehicles"
              min="1"
              max="5"
              required
              value={numVehicles}
              onChange={handleNumVehiclesChange}
            />
            <label htmlFor="depot">Depot:</label>
            <input
              type="text"
              id="depot"
              required
              disabled // Disabled the input field for now
              value={depot.formatted_address}
              onChange={handleDepotChange}
            />
            <button className="btn btn-primary">Optimize Routes</button>
          </form>
          {optimizeRoutesIsLoading && <p>Loading...</p>}
        </div>

        {/* Conditionally display optimization results if available */}
        {optimizeRoutesData && (
          <>
            <hr />
            {/* Results Section */}
            <div className="page-section create-routes-results">
              <h2>Results</h2>
              {/* Display each optimized route as a button which opens the route view */}
              <div className="create-routes-results-buttons">
                {/* {optimizeRoutesData.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => setModalViewRouteOpen(route)}
                  >
                    <b>Route {index + 1} |</b>
                    {` ${route.deliveries.length} stops | ${(
                      route.routes[0].distanceMeters / 1000
                    ).toFixed(1)} km | ${route.deliveries.reduce(
                      (acc, id) => acc + parseInt(deliveries[id].demand),
                      0
                    )} demand`}
                  </button>
                ))} */}
                {optimizeRoutesData.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => setModalViewRouteOpen(route)}
                  >
                    <b>Route {index + 1} |</b>
                    {` ${route.deliveries.length} stops | ${(
                      route.routes.reduce((acc, route) => {
                        return acc + route.routes[0].distanceMeters;
                      }, 0) / 1000
                    ).toFixed(1)} km | ${route.deliveries.reduce(
                      (acc, id) => acc + parseInt(deliveries[id].demand),
                      0
                    )} demand`}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}

      {/* Add delivery modal */}
      <Modal
        isOpen={modalAddDeliveryIsOpen}
        onRequestClose={setModalAddDeliveryClose}
        style={addDeliveryStyles}
        contentLabel="Add Delivery"
      >
        <button className="modal-close" onClick={setModalAddDeliveryClose}>
          ✖
        </button>
        <div className="page-frame">
          <h2>Add Delivery</h2>
          <hr />
          {/* Add delivery form */}
          <div className="page-section">
            <form
              className="form add-delivery-form"
              onSubmit={handleAddDelivery}
            >
              <label htmlFor="streetnumber">Street Number:</label>
              <input type="text" id="streetnumber" required />
              <label htmlFor="streetname">Street Name:</label>
              <input type="text" id="streetname" required />
              <label htmlFor="postalcode">Postal Code:</label>
              <input type="text" id="postalcode" required />
              <label htmlFor="city">City:</label>
              <input type="text" id="city" required />
              <label htmlFor="province">Province:</label>
              <select id="province" required>
                <option value="AB">AB</option>
                <option value="BC">BC</option>
                <option value="MB">MB</option>
                <option value="NB">NB</option>
                <option value="NL">NL</option>
                <option value="NS">NS</option>
                <option value="NT">NT</option>
                <option value="NU">NU</option>
                <option value="ON">ON</option>
                <option value="PE">PE</option>
                <option value="QC">QC</option>
                <option value="SK">SK</option>
                <option value="YT">YT</option>
              </select>
              <label htmlFor="demand">Demand:</label>
              <input type="number" id="demand" min="1" required />
              <button className="btn btn-primary">Add</button>
            </form>
          </div>
        </div>
      </Modal>

      {/* View route modal */}
      <Modal
        isOpen={modalViewRouteIsOpen}
        onRequestClose={setModalViewRouteClose}
        style={viewRouteStyles}
        contentLabel="View Route"
      >
        <button className="modal-close" onClick={setModalViewRouteClose}>
          ✖
        </button>
        <div className="page-frame">
          <h2>View Route</h2>
          <hr />
          {/* Route Map section */}
          <div className="page-section">
            {selectedRoute && (
              <div className="create-routes-view-route">
                <RouteMap
                  depot={depot}
                  route={selectedRoute}
                  deliveries={selectedRoute.deliveries.map(
                    (id) => deliveries[id]
                  )}
                />
              </div>
            )}
          </div>
          <hr />
          {/* Route details section */}
          <div className="page-section create-routes-view-route-details">
            <h2>Route Details</h2>
            {selectedRoute && (
              <div>
                <p>
                  <b>Number of Stops: </b>
                  {selectedRoute.deliveries.length}
                </p>
                <p>
                  <b>Estimated Distance: </b>
                  {(
                    selectedRoute.routes.reduce((acc, route) => {
                      return acc + route.routes[0].distanceMeters;
                    }, 0) / 1000
                  ).toFixed(1)}
                  km
                </p>
                <p>
                  <b>Total Demand: </b>
                  {selectedRoute.deliveries.reduce(
                    (acc, id) => acc + parseInt(deliveries[id].demand),
                    0
                  )}
                </p>
              </div>
            )}
          </div>
          <hr />
          {/* Deliveries section */}
          <div className="page-section create-routes-view-route-deliveries">
            <h2>Deliveries</h2>
            <ul>
              {selectedRoute &&
                selectedRoute.deliveries.map((id, index) => (
                  <li key={id}>
                    <b>Stop {index + 1}: </b>
                    {`${deliveries[id].formatted_address} (${deliveries[id].demand} demand)`}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateRoutes;
