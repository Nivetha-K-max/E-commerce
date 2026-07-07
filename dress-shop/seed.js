#!/usr/bin/env node
/**
 * Seed script — adds/updates sample products to the running backend.
 *
 * IMPORTANT:
 * - This script is intended for your local dev DB.
 * - It uses POST /api/products which (in this MVP) typically creates new products.
 *   If products already exist, you may need to clear affected categories in the DB.
 *
 * What it does for your requested change:
 * - For categories "Jeggings" and "Shorts": it seeds ONLY 10 products each.
 * - For those categories: it assigns images from the Google URLs you pasted.
 */

const API = 'http://localhost:8080/api'
const ADMIN_USER = process.env.ADMIN_USERNAME
const ADMIN_PASS = process.env.ADMIN_PASSWORD

if (!ADMIN_USER || !ADMIN_PASS) {
  console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD before running this seed script.')
  process.exit(1)
}

const CATEGORY_IMAGES = {
  'Kurtis Set': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOZKwRU7yoQqWWIvrwN4ljw1YiIf1glBZfhQQt6Wfapw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwaWFrMeHNiF0qfGGxg8EFH3cn_hfg4H3Ofukbir3w5w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyil0XLpW4LX3xfk85zKE3ZFj8a3w3eusZ7Zp-as-msQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2zIXAchYAWJWPYRMC3t47zYArFT1AMzA2R77i9SQjxA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB8ZPBaXY2lgers9jgdE4X2Mvn3cm7slGXfRckdelyuw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWlJfLAgZrZp_7EGQE04pwDjq8KmfNxttf8_R-P_lztA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvcq2Ywsn1UqIrYUgAwTmtUXUcFTQVL-G90AFyS0i3Ng&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT77DUSdae4JRJABV9gy7nonyUtim_ghyxns0w4rpwBvg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK_cxypa50sXcqNOGhz7I6hVCMkjAoa9o_4wzalDwEtg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYDUjp7ygF9RcweQnnGfkvnQiztm8ThWHAc1g49Kkzjw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhn1n7TyKp90HmolYsCK2XBb_ZLzuc0IDt7G9Vizax5w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-3GPX6ttVQNw9YpwcmthIdxjNDTsF7S6m-wtIPwTwjQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhD9nYJXm00ergMeXgnXTV2CuSjTVrNsthOR6PAr_kPg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhIgK6jsKqp1B9nctPkGGHyHGAWjCg2mPeeNWuLphvGA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtZb828yxqvNFS7mQbM_O9JVMHaklxwdgxBm6yhD3f4w&s=10',
  ],
  'Palazzo Pant': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnjymJinBnWf6ZkqtcCROf-2JKY983CNSxDiOV4y-yQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgDalDJx8ValMnT3vVsfsMnEiWYPuOIrjJpHDF3xwsmg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2z20VokEZIP5eAnCAThDkNLVxByxHdeBs0F6nz1AaCQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKZVWHyHd9aEisswY1fAevyIGhGLlrLMr1bXuu5UIjtA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdTpX7pz8wNUGJTFeabThANC4Jjf0MExtSxJWCzRDqdw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Uc00gsfVC3iPLTw2-pz7XW-uLDfnWw05AM6hzvP2tg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBV6MFIqzYUHsdJrkxnvj55SFCpdd56DfwE0uKKvyegQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9UZQzxebJzdUPuiB9yEoR6Pr4ixLBQ21j2CS--6jd9g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5zasXAXzLRqSY4Zf3tNZI74IxQMt-Jf-S5lL-6-QJNw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZcWqnZ3gzF8EbVH0ttC1hKS-kg4FaMtEl_ujuN1m0Pw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMMdaZq5PoB1iMIA3gusQyBGSirXBkoyVW9vNjyqCrg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQatGWg_n0M-58zCvswVofMtkGxMam1qO31ghkf20rnsQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKWwhu_b0vjnt1_-c9WIkzMnvqyP97wi_tMBRjUMzGuQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTrrkXkLTposxRB1EvgqhfLW--S__YoPlIMjzV1jdwTQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa48lgt32K3QmGn8rNJaDuw_XEKUyj4F09JUo4SuLJsg&s=10',
  ],

  // Updated per your pasted Google URLs
  'Jeggings': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5l2WB7guVtDkoQmNmgp2r38Bp-rRCqnwSaV-CC1jjBg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiJ6gWOoy1D6FRIAfDSh_55mKAClU7u3-5THK5ch1fXA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJYptLqlbBWlUHpM0JmEA3lrvd3FdDlcj5_GYtqWdR9g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToLLuf3qMiwO42fDk7P_4yB_UR1750ImV4tVBKRi44RA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs-6B2x-fSrScLJ5ILy57YT2G8ZBzgv0TLZ5tdu2-O6Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTecStbR8mh96wCAXwfrnF4aiQ1hdwRnXWOJYakLBQk2w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_-Rf8_TUMowR-iqzd5T2I9aM3uwuQDwPr0gJSro-z5Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4TK-nBfpvZaprqBTtNiv-poqZ8kc_X0bskn79hnEBvw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRogYHjppw2wPu0ZPzS-HdE_ykvcW95T_powQYUdS3aww&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKJSXujkDnwgNM5CpyVPcKz02n0vyF9WCmP76b_G-b0g&s=10'
  ],

  'Leggings': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTUdHZKLkswTZasB5fI0-ERc0oh0NMWpZNxEBzh45WRw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ20p99hPsfOCL3dldYMzhgoB-nmtumTix5LAKicrgnIA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRETn83hciSAjPgB-dgVQYys4biIreMOc_aKMJp74WmaQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5-LcYWxxpZhLvMO9rm3affx-gLyGjNns25Q4fz3fCA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTStP5DYUrshzSIE_-RKa6MSiV9oC6uqmmN44VeWezOmQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS14qP8ZttYMrkmEyEA51axxc53VWW_3Y9Xic5pW6RAWQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0gi6Ik7dyvCfbuZjp0oIuMbmqET_lBOjgUIuPeKlxOg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMyGrC4H1i-bqjGGUjargZzH7cQo_rPmTIgIzN2eDQHw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaxwMkizlBb3gCKRqbs4fnzaq8cySWWjjaQ8ZlN9FGHA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFZTKgdXaUy1ZbaYR4CymdoOREDjCD5TZhmn89PVZRkQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzgaD0fZhLOpj5YA7ZKhxlDvttKjysl8LyKuJxdp-HNA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp69Qw_6TrIpnUgpVk0lX9dzD1wcNIAV5-AF4Gob5c5g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF3TlOg-RwTR3hkeBT_2vD_xvWdz6bclvQy342mprGRA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbN3d56PKOWQXaVHA7MCRTNRC7ti1Z80HzxRF16dOUA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoQKxEaValObxUh4OQwBdKrDuVtAznonj1Gp5VVdhLGA&s=10',
  ],
  'Western Top': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHtGs_sFsUxsSyD31tZ72TTpz9z72rZVNSeCdUfBPlIQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsjwrISxe6TFvbQ9dT8OSdgYNYdi-Vwk3203ln-DA2Fg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoR4pHNmnZbZIZDOYoP0DE9jEUApoC-9MtCYzx9HH8QQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdNFaOiOBMiMjiIDlspLKotK4JtnPMdSftPMXFlsm01w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ43FrqGN7gKECX3CauOoPv-bcIfRYf6r5EDQbQXPqLfA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdloFXeNT_DeExQNwQEokKjqX6MkVzjdha_Pccm_t76w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcLV60-YN0QHjFZ5ZEbz206lmO-rG2QfJiqN8EHxqVkg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2g3q7ded1WEcqGDZAd56vPC8BnzAGDORUp1OyMChroQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi3APr9CyCtHc-0gzatZLLWauikL48LBZlRivIJumrDA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSewPwqRSLcXEJ5f728hCShdmsqnzZcAGdful8MNsoQeA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIuiqXfauivhIvWik7lWg1Xod4IZuTgjpeBZCkG4Fqmw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfy4DyePXBGt3McKoUM3KsrEACdYjI_Vx5yL1l-phZVA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDKvbBIyVRFvqsaVg-3sKJj5TP8pDtySUKxHC1MoxO9w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIp0UbE70viksFyOPqEqo-MHfT3K9MPamQQ45P1iAk-A&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRInjWSg1k4azvsYr9V0aH34Xm45RcJAeHZZKN4D59bZA&s=10',
  ],
  'Maxi': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzs86tvAT5T7hwxs6kAdtWtlc3yfFBitcqaWwbW9vjmA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHc78T5RK5TzzufV5W4u9H2g-chuPIJIu_scpw9eVTw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnmTUrQ0a0XbAv1pgDfSUQ3BO7f6eW6AHZOH7e4EOtRw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHLIZ7755qTZYr-2n5E8kQbYB8PhVZQzf-IQcLu_qHg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmlxHZixbHZnrDsCqbbPHJtOG88C-zTEiTNPsPZvCtjw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9NCPdxmrxtysl40rQlxLgntrMSHcaWbIcMLWku-16XQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAnpI0-AkGw5TdwG7QQBA8f4-jtZF8czI5y38dtk_Ojg&s=108',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRERID1iuCTDsAYP945KbCWHThaCEPVhGx4cD1DXdZ-uQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNsIgjwKR85XVYtLqAShfz019sNfuJA9jeTqfXPYqtYg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVV3W4E9BE0OECNT0J_9QH6Gg394_lIQDgJ8Lh7fcqwA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQknt81xxXkBNiD0qsE9Fy2i2o0UyOc4mohUNn0oxbhTQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsiDpoavVxUzqC4zdys4frXVsw_3yRXUVTfsjlu4KD9Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIExFn9gQ6mwAWTsbdEGx9oXtkKWUo63LZfB0ZS2OfkA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE3HjuwVrlyiviMv5J0U4nSLvJb116c5J5o5GZKnsEpA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-2pOI3sq8WTduJygenABpaE_8cG5CaD0Z-VbAftx-3g&s=10',
  ],
  'Party Wear': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCWczBEckf4odS4lSmiIDZmizyW2Mg2wdDDdFwp6yEDg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROCk7AQY29bQQQmsEeP4CGv8vcNHz4xuBM7vjv4P8KBw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXGCFAcWl5MF3GLoScbExHue1Hi6DISZGpQbIy8f8PkA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgqLkoOHb6CpGYieOJAsJNZ8yIk4dIgM52vU31ErpVKg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_pbzO9HZK2GzPWf5TBQbSewuYZdOXbnrP5e7HkaOdFA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLRrLjRDzLSH7gxyfhQjhNtDqq9kxw7N1GoL5xijdunw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHX3ULg94CSmK78Dj2OP8K_HlE-32rdQCQzQVaYw_5Xw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJLrcteEsmqYih7MxbpltireRImjTaSA_OnlMkFoQ9g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSilPF5aF6718W9GgOxBVkN_2WUYtnISe_8fDrSD78vpQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSakYc_1xcSO2OoN611-wJ5yVL5sXNqTzot5abJg6H6QA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8e2OS8ewlSPDaBy6gMnH_CSta1IBrIRDXhd4UhakXZg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDcIREjn8EbXvXEjiHu0Vr6WoaC_n7jZs_ffVzRUe3Wg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7_tHq568I21pJrB1yz6isQPUfigGHkQTdP6D8naDVoA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY3Fds4IpvxNV9Jyx2Y8Zxq-99k0OD9vDh6ppOUrFvZg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDs0suSy4FcUg5zyloSrYPJhJH3Rl-nqKoPxi0tWM4qWx0Y_E6K9wQTH0&s=10',
  ],
  'Skirts': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjLUWKEprACDg0rz_Cwe-JIltdn1HBsk9bn5WoMp-76w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9wQ9Bz2qBYYUWC2xMyWRfIyMMpOs-TRVgDyVwKNDNtA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqd9ZTNMksTuTTfrM8omhahyrAvfBdxS1yAZWaZVpUFA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBFdZ6MM6cVXp_npGOW8nDDEBWRrIgbW6bDe64XjE-9Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS7mmuOtvReaNk-nhDUptSTV-1MjzA1oQQZrLQMw7BUg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnd33ezyqf-MckjmGMqboYdJyhaHClKbfKpy8dhglVaw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSinZNNrZn6nBcSQeRULG0Lc3mPZ3o467H5EaHxSN2S9g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdesGDYzG6OuZYov_RkyvDj6fh-5K7eulOFacWWFRWow&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn16zTQDUPfOk91zcaL59dB3o5I4A_kgAsk3FhqNnuSw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTSXsRzeNo1YPy5qNKLIGhP6rXAOOZP8mA32WUPaPmOQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvH7pHRkcM0fLbHRSmVUonFI-f3_UtDJkeBS4pzfNKHg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Wfg9OybPM2-hMCXlSxgW5X7FDyVIr-z8pgPs_C5E3g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGGKQbq2aOqU09eNcP_bEEz73bTQRVRz5AnHSW2iaYRg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn6G2fsacfhhUAUGnKLc08Lv4AD0435yzTU0_waDf8LQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCyRO0w2UUexSn9JlanR2aImEeMRQxGKIwsz_QEqq8cQ&s=10',
  ],
  'Night Suit': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgS_1Bv49cnme-c8FYB_qY2po_t8JA7YkQdWUwDe63UA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk8lpLLg-_0x4B_z0kj4H-GSVeAbutKS8WABQDOPl30A&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjSjuhajktLQwRxnkIVhcCwhYzNZPvQChjZJNZ84LOsA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe5Jz-7fcowK1vXoKps5nN5Vp8g8YwE3n1shnwEKDOsg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQf6Y4UEl2JDjpHWKbongsb75redajL2LWKIXLHA5hPg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzbCkMHjtq_xL2wSTua7vjZxz3mLAMQY-tPSwEs4st-A&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrhRCq7icQUD0lz-s6SZpeT9jqL7_zca14pVEYGX0NQA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2lcfMVswmwpiWlqip2qWTx5uyTuoWMTqPhmWtJnrvgQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-K6YVaaZgYued_aqqSEdxNlDcsTWVP_ub5ACovAvkg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqtvF-In4G6NPiPW0au7UjyjqmakMJw2PbD1sDXBFutA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREHIXsKBo_eWsEDHZ2v9EBtubUJa5VcGsvRGsFZehRqQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTIkogFyS0WieC1Gc5txubJE8_mjeg8ZNT8-9q5cN-OQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk-EtO1K1GlahtIzTcPd0lvzsxZMfO_A9u-vrRBnUK3w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPAXT9NZkTOe0lbGzgByAMlsDYl6Vy9QvmTMh9SDaOTg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV86b85_QN8Ms8g7sMLkHAWywdr-UtAtAbUVv8oynUuw&s=10',
  ],
  'Night Pants': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUGApkr6jpy0KR-8e0BN9_ZxNSxFHxUp7uMWwu44pMvA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK7AmZXmbmsVzm8SDkYxsee6iBdXTV7bjC8L1NULEeVQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn6wf58YAOTtu9jKuAWuw36VNECvmvaWUcenHZ5iQ5yQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHr5jKo001zSyUdw_CoO6UtqFz2SvuzlLRh0WcDNm2g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqPIA9jlmo9xIIrBzxTwxm-b27AQWwVLhsPNr7BeiFGA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK9tUsCa53LNN1D4ypRCKtfz4DY6lsEghYd5kjrdREdQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0XCVasBmuVAUmjVl8_rOt4aYyJn60XQWExQp_YbQO6A&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuMdUtb-mJgRhVy17_u__OazHbBTHYUtNV1CV8Sol-9w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBfhC81kVeCj_WAZLImV0uhzEU9Miw6i0EmA2hgpRw9A&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkInJdPQOPaO8qKYlNCNdh3XGi-uryr0RmuUsfg9hzZA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbcuqvwizIeehkv7M1gQOTeH6fdwivndZKLmTnfpeuDw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW-4-b0qUnbRcjKue5uAswvccbABct-X7shVjvs4xLxA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTc5y248R8TnvMqu7p1SThmOdrT4-WSXJyGs1SRma1Cg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs70H3xdDPK-HTO7x0fYeQUN5ErmCpkDc6XBPnJCFjvw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzAzzTiHb_rgfAmKA3aVJRQe5-bg7NDggYRY0DFLcKgA&s=10',
  ],

  // Updated per your pasted Google URLs (10 each)
  'Shorts': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp-RdP1eH221VmF6AOMonNpTYNh08akvLcgVVKNE5jsg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsDOFc_bD2DJg9XdVNq64Si8o-XjRnvvwFL634PKLDKw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYDqk2LI2wbiu0aZjPJVGfCbhNvtbofY8TWWSeCjY1QQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzKRCEhYCKY5a5WCYgNuxtebku8Xe39zbC-58Io6zd5g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnlSJFyNuH2SS-PggN4uaP6PrDJ_hD5tlfnnbjzThMUA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPeRYBX6RheoFsnHLaV6truAMnaWMaqJzT6PjvkMwMA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBohTaFZQhq6_DgoonjwcGg6Et-NNyIh4HUsKWBKoZkQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRofWn3uc4d-hWuqOLemWO3f6k1FCYet08oLdVM5cl69w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY86iK2hI5L2l2dlNrD_qwdW4Ris-RO1m9jcexFPsNmA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSok4Phz7CsoyP2nptyqNv9EAUU9VctPdyYL6pUN5hbrg&s=10'
  ],

  'T Shirt': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvtInYQPpAWuNIli9qnbRpX3DF7CqkaC8-WQEAiMNblQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg7E4u8G7vJaKJT-tg-Noy5CcuVfX_pw8-qlEwOkKMog&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGm5U6W2Fxr0WQW36ZIPaylQALFHOuUic_GHWr1iH2qw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSbX8YV394CZQvZlPtQ6v6zUaU3NwyhZnWtqQf6opcmQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7aedqBybQhSWIZhJxscUt3gm0l2eO_5rML3LrJNZRNg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcJi3cQnwT8v6bd3a8V-fEV85HadXkpmQY5h5-LWrO7w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKmAnuKB9FBTNDJMSSGuKyUU4c3ogyG2B0CG4I13jNSA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtOSL49f0BRl2Mcq0K4BhMv53MuyUBukSIbOHIEo1bIg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoc9dfW-lw-oRWotoeZ-vj6WeTTINcTcM2GHff9-KR2A&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThcSykwJ_M7PBLaHEGqruVFBPeHgvbF0XW0QTTXhY3fA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMKXn1RXH97xTzEDaN165AnNOmomixR2EDqInIQLfnEg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1AP1PsJm_8SXi-4XFP5XcWDRX36SNOJCdO1T-_oKmhA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7uiXez1HCRjid1arIqrR7E1z3yVQKd4lz7E1MJAYoOw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKZxxG-auukIFSrfDY1T-HYDHqfJE2M6F7OW8Me7zjGw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuVO9UqmBju1JeOe7jy_k56d3I35yxI-kLl1ncC4-27g&s=10',
  ],
  'Crop T Shirt': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkuKV6Hbu5T_6K_0zE5eq4vhUyq50jIP-7az4qWEwt2g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6WQsy0wa7XVqLYGVwb2zNF05U0qV7kyzJog-BI_APBg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ppfFm2MSeSMtE1E5dgU4ZJTaWMcJyEdghv-NI79ORA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3hw-6oykkrBf17zbUidJyEVcoNZI1dBKXw_JKZsI5EA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFaVBbCLGyBME4tYITvQaz-fMvLyNrQkDyJ6fYuWza5A&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9BRqOlS7CSG9aHWROrW2cbgXeQkj_OZS022B0j5bIFw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQpmGEbgzPqpM615rUXVM0Iy-Bz_jP8aG4M6l97PCc6g&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6l31_Ha0w1kzo7awKQZo2AS67-lxLS742Ghkq1dx6UA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw6o1hoSBhbyvHAjA50F44MCHm1VSMyJ4OR3fI840Z5Q&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-wqJdw1sud1CkmfpHMZy2rh_vXG0cfZq4TUkjmYb9Mg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqicwQZZKPVtT1TPsDSpnC4iw3wP48zvy2kQD1D-eHA&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWwbzcSMRarZ9yzBV5pAuSM7tN_Vrm3aGPtZ9w5iGoKg&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjBjQ13_wuarseTgQeaBHsGAMRkjpa7xPyphycbMX3Vw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnXNNB3PaI1Eg95UDzOC2EiJtE24faVb3GV1xueZVXhQ&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxsmbaZ4T8EKAYSRjAGWchoFPYOBht1jvF_pOaUFFq6g&s=10',
  ],
}

// Seed products — 15 per category originally, but for your request:
// - Jeggings: ONLY 10 items
// - Shorts: ONLY 10 items
const PRODUCTS = [
  // Kurtis Set (15)
  { name: 'Cotton Kurtis Set', category: 'Kurtis Set', price: 699 },
  { name: 'Printed Kurtis Set', category: 'Kurtis Set', price: 749 },
  { name: 'Embroidered Kurtis Set', category: 'Kurtis Set', price: 999 },
  { name: 'Anarkali Kurtis Set', category: 'Kurtis Set', price: 1099 },
  { name: 'Straight Kurtis Set', category: 'Kurtis Set', price: 799 },
  { name: 'Office Wear Kurtis Set', category: 'Kurtis Set', price: 849 },
  { name: 'Floral Kurtis Set', category: 'Kurtis Set', price: 749 },
  { name: 'Designer Kurtis Set', category: 'Kurtis Set', price: 1299 },
  { name: 'Rayon Kurtis Set', category: 'Kurtis Set', price: 699 },
  { name: 'Linen Kurtis Set', category: 'Kurtis Set', price: 899 },
  { name: 'Ethnic Kurtis Set', category: 'Kurtis Set', price: 949 },
  { name: 'Festival Kurtis Set', category: 'Kurtis Set', price: 1099 },
  { name: 'Summer Kurtis Set', category: 'Kurtis Set', price: 649 },
  { name: 'Chikankari Kurtis Set', category: 'Kurtis Set', price: 1199 },
  { name: 'Plus Size Kurtis Set', category: 'Kurtis Set', price: 799 },

  // Palazzo Pant (15)
  { name: 'Cotton Palazzo Pant', category: 'Palazzo Pant', price: 449 },
  { name: 'Printed Palazzo Pant', category: 'Palazzo Pant', price: 499 },
  { name: 'Black Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'White Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'Linen Palazzo Pant', category: 'Palazzo Pant', price: 549 },
  { name: 'Wide Leg Palazzo Pant', category: 'Palazzo Pant', price: 499 },
  { name: 'High Waist Palazzo Pant', category: 'Palazzo Pant', price: 549 },
  { name: 'Ethnic Palazzo Pant', category: 'Palazzo Pant', price: 599 },
  { name: 'Casual Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'Office Palazzo Pant', category: 'Palazzo Pant', price: 499 },
  { name: 'Floral Palazzo Pant', category: 'Palazzo Pant', price: 449 },
  { name: 'Designer Palazzo Pant', category: 'Palazzo Pant', price: 699 },
  { name: 'Summer Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'Solid Palazzo Pant', category: 'Palazzo Pant', price: 349 },
  { name: 'Party Palazzo Pant', category: 'Palazzo Pant', price: 599 },

  // Jeggings (ONLY 10)
  { name: 'Black Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Blue Jeggings', category: 'Jeggings', price: 349 },
  { name: 'High Waist Jeggings', category: 'Jeggings', price: 399 },
  { name: 'Stretch Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Ankle Jeggings', category: 'Jeggings', price: 329 },
  { name: 'Plus Size Jeggings', category: 'Jeggings', price: 399 },
  { name: 'Casual Jeggings', category: 'Jeggings', price: 299 },
  { name: 'Skinny Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Denim Look Jeggings', category: 'Jeggings', price: 399 },
  { name: 'Cotton Jeggings', category: 'Jeggings', price: 299 },

  // Leggings (15)
  { name: 'Cotton Leggings', category: 'Leggings', price: 249 },
  { name: 'Black Leggings', category: 'Leggings', price: 249 },
  { name: 'White Leggings', category: 'Leggings', price: 249 },
  { name: 'Ankle Leggings', category: 'Leggings', price: 229 },
  { name: 'Full Length Leggings', category: 'Leggings', price: 269 },
  { name: 'Printed Leggings', category: 'Leggings', price: 299 },
  { name: 'High Waist Leggings', category: 'Leggings', price: 299 },
  { name: 'Gym Leggings', category: 'Leggings', price: 349 },
  { name: 'Casual Leggings', category: 'Leggings', price: 229 },
  { name: 'Ethnic Leggings', category: 'Leggings', price: 279 },
  { name: 'Plus Size Leggings', category: 'Leggings', price: 299 },
  { name: 'Grey Leggings', category: 'Leggings', price: 249 },
  { name: 'Maroon Leggings', category: 'Leggings', price: 249 },
  { name: 'Navy Leggings', category: 'Leggings', price: 249 },
  { name: 'Stretch Leggings', category: 'Leggings', price: 269 },

  // Western Top (15)
  { name: 'Casual Western Top', category: 'Western Top', price: 399 },
  { name: 'Printed Western Top', category: 'Western Top', price: 449 },
  { name: 'Floral Western Top', category: 'Western Top', price: 449 },
  { name: 'Solid Western Top', category: 'Western Top', price: 349 },
  { name: 'Crop Western Top', category: 'Western Top', price: 399 },
  { name: 'Full Sleeve Western Top', category: 'Western Top', price: 499 },
  { name: 'Party Western Top', category: 'Western Top', price: 599 },
  { name: 'Office Western Top', category: 'Western Top', price: 549 },
  { name: 'Ruffle Western Top', category: 'Western Top', price: 499 },
  { name: 'Peplum Western Top', category: 'Western Top', price: 549 },
  { name: 'Black Western Top', category: 'Western Top', price: 349 },
  { name: 'White Western Top', category: 'Western Top', price: 349 },
  { name: 'Summer Western Top', category: 'Western Top', price: 399 },
  { name: 'Trendy Western Top', category: 'Western Top', price: 499 },
  { name: 'Designer Western Top', category: 'Western Top', price: 699 },

  // Maxi (15)
  { name: 'Floral Maxi Dress', category: 'Maxi', price: 799 },
  { name: 'Black Maxi Dress', category: 'Maxi', price: 749 },
  { name: 'Party Maxi Dress', category: 'Maxi', price: 999 },
  { name: 'Cotton Maxi Dress', category: 'Maxi', price: 699 },
  { name: 'Printed Maxi Dress', category: 'Maxi', price: 749 },
  { name: 'Sleeveless Maxi', category: 'Maxi', price: 699 },
  { name: 'Full Sleeve Maxi', category: 'Maxi', price: 799 },
  { name: 'Boho Maxi', category: 'Maxi', price: 899 },
  { name: 'Summer Maxi', category: 'Maxi', price: 649 },
  { name: 'Designer Maxi', category: 'Maxi', price: 1199 },
  { name: 'Red Maxi Dress', category: 'Maxi', price: 849 },
  { name: 'Blue Maxi Dress', category: 'Maxi', price: 799 },
  { name: 'Casual Maxi', category: 'Maxi', price: 649 },
  { name: 'Long Maxi Dress', category: 'Maxi', price: 749 },
  { name: 'Wrap Maxi Dress', category: 'Maxi', price: 849 },

  // Party Wear (15)
  { name: 'Gown Party Wear', category: 'Party Wear', price: 1499 },
  { name: 'Sequin Party Wear Dress', category: 'Party Wear', price: 1699 },
  { name: 'Cocktail Party Wear Dress', category: 'Party Wear', price: 1299 },
  { name: 'Black Party Wear Dress', category: 'Party Wear', price: 1199 },
  { name: 'Red Party Wear Dress', category: 'Party Wear', price: 1299 },
  { name: 'Designer Party Wear', category: 'Party Wear', price: 1999 },
  { name: 'Western Party Wear', category: 'Party Wear', price: 1099 },
  { name: 'Long Gown Party Wear', category: 'Party Wear', price: 1799 },
  { name: 'Short Party Wear Dress', category: 'Party Wear', price: 999 },
  { name: 'Evening Party Wear Dress', category: 'Party Wear', price: 1399 },
  { name: 'Floral Party Wear', category: 'Party Wear', price: 1099 },
  { name: 'Net Party Wear Dress', category: 'Party Wear', price: 1299 },
  { name: 'Wedding Guest Party Wear', category: 'Party Wear', price: 1599 },
  { name: 'Stylish Party Wear', category: 'Party Wear', price: 1199 },
  { name: 'Women Party Wear', category: 'Party Wear', price: 999 },

  // Skirts (15)
  { name: 'Mini Skirt', category: 'Skirts', price: 449 },
  { name: 'Midi Skirt', category: 'Skirts', price: 499 },
  { name: 'Maxi Skirt', category: 'Skirts', price: 599 },
  { name: 'Pleated Skirt', category: 'Skirts', price: 549 },
  { name: 'Denim Skirt', category: 'Skirts', price: 499 },
  { name: 'Black Skirt', category: 'Skirts', price: 399 },
  { name: 'Floral Skirt', category: 'Skirts', price: 499 },
  { name: 'Pencil Skirt', category: 'Skirts', price: 549 },
  { name: 'A-Line Skirt', category: 'Skirts', price: 499 },
  { name: 'Cotton Skirt', category: 'Skirts', price: 399 },
  { name: 'Printed Skirt', category: 'Skirts', price: 449 },
  { name: 'Long Skirt', category: 'Skirts', price: 599 },
  { name: 'Casual Skirt', category: 'Skirts', price: 349 },
  { name: 'Party Skirt', category: 'Skirts', price: 649 },
  { name: 'High Waist Skirt', category: 'Skirts', price: 549 },

  // Night Suit (15)
  { name: 'Cotton Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Printed Night Suit', category: 'Night Suit', price: 549 },
  { name: 'Satin Night Suit', category: 'Night Suit', price: 699 },
  { name: 'Shorts Set Night Suit', category: 'Night Suit', price: 549 },
  { name: 'Full Sleeve Night Suit', category: 'Night Suit', price: 599 },
  { name: 'Summer Night Suit', category: 'Night Suit', price: 449 },
  { name: 'Winter Night Suit', category: 'Night Suit', price: 699 },
  { name: 'Cute Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Women Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Floral Night Suit', category: 'Night Suit', price: 549 },
  { name: 'Button Night Suit', category: 'Night Suit', price: 599 },
  { name: 'Soft Night Suit', category: 'Night Suit', price: 449 },
  { name: 'Plus Size Night Suit', category: 'Night Suit', price: 599 },
  { name: 'Pajama Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Designer Night Suit', category: 'Night Suit', price: 799 },

  // Night Pants (15)
  { name: 'Cotton Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Printed Night Pants', category: 'Night Pants', price: 329 },
  { name: 'Check Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Soft Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Women Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Pajama Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Black Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Grey Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Floral Night Pants', category: 'Night Pants', price: 329 },
  { name: 'Wide Leg Night Pants', category: 'Night Pants', price: 349 },
  { name: 'Summer Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Winter Night Pants', category: 'Night Pants', price: 349 },
  { name: 'Stretch Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Casual Night Pants', category: 'Night Pants', price: 269 },
  { name: 'Comfortable Night Pants', category: 'Night Pants', price: 299 },

  // Shorts (ONLY 10)
  { name: 'Denim Shorts', category: 'Shorts', price: 449 },
  { name: 'Cotton Shorts', category: 'Shorts', price: 349 },
  { name: 'Black Shorts', category: 'Shorts', price: 349 },
  { name: 'High Waist Shorts', category: 'Shorts', price: 399 },
  { name: 'Gym Shorts', category: 'Shorts', price: 299 },
  { name: 'Casual Shorts', category: 'Shorts', price: 299 },
  { name: 'Printed Shorts', category: 'Shorts', price: 349 },
  { name: 'Summer Shorts', category: 'Shorts', price: 299 },
  { name: 'Running Shorts', category: 'Shorts', price: 349 },
  { name: 'White Shorts', category: 'Shorts', price: 349 },

  // T Shirt (15)
  { name: 'Oversized T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Graphic T-Shirt', category: 'T Shirt', price: 399 },
  { name: 'Printed T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Black T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'White T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'Cotton T-Shirt', category: 'T Shirt', price: 279 },
  { name: 'Casual T-Shirt', category: 'T Shirt', price: 279 },
  { name: 'Round Neck T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'V-Neck T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'Striped T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Plain T-Shirt', category: 'T Shirt', price: 249 },
  { name: 'Full Sleeve T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Half Sleeve T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'Trendy T-Shirt', category: 'T Shirt', price: 399 },
  { name: 'Women T-Shirt', category: 'T Shirt', price: 279 },

  // Crop T Shirt (15)
  { name: 'Oversized Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Graphic Crop T-Shirt', category: 'Crop T Shirt', price: 399 },
  { name: 'Printed Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Black Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'White Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'Cotton Crop T-Shirt', category: 'Crop T Shirt', price: 279 },
  { name: 'Casual Crop T-Shirt', category: 'Crop T Shirt', price: 279 },
  { name: 'Ribbed Crop T-Shirt', category: 'Crop T Shirt', price: 329 },
  { name: 'Full Sleeve Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Half Sleeve Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'Striped Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Anime Crop T-Shirt', category: 'Crop T Shirt', price: 399 },
  { name: 'Gym Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'Trendy Crop T-Shirt', category: 'Crop T Shirt', price: 399 },
  { name: 'Solid Crop T-Shirt', category: 'Crop T Shirt', price: 249 },
]

// Clean products: remove items whose names are purely numeric or end with
// a numeric token (e.g. "1", "2" ... "15"). This prevents seeding
// placeholder-named items like "Short 1" that aren't used.
const numericNameRegex = /^\s*\d+\s*$/
const trailingNumberRegex = /\s(?:[1-9]|1[0-5])\s*$/
const CLEANED_PRODUCTS = PRODUCTS.filter(p => {
  if (!p || !p.name) return false
  if (numericNameRegex.test(p.name)) return false
  if (trailingNumberRegex.test(p.name)) return false
  return true
})

// Mark first 3 of each category as new arrivals (for categories that have >= 3)
const CATEGORY_ORDER = Object.keys(CATEGORY_IMAGES)
const NEW_ARRIVAL_NAMES = new Set(
  CATEGORY_ORDER.flatMap(cat => {
    const items = CLEANED_PRODUCTS.filter(p => p.category === cat)
    return items.slice(0, 3).map(p => p.name)
  })
)

function pickImage(category, index) {
  const v = CATEGORY_IMAGES[category]
  if (Array.isArray(v)) return v[index] || v[0]
  return v
}

async function seed() {
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  })

  if (!loginRes.ok) {
    console.error('Login failed. Check ADMIN_USER/ADMIN_PASS and that the backend is running.')
    process.exit(1)
  }

  const { token } = await loginRes.json()
  console.log('Logged in as admin.\n')

  // Track per-category index to rotate image URLs for array-mapped categories.
  const perCategoryImageIndex = Object.create(null)

  let added = 0
  for (const p of CLEANED_PRODUCTS) {
    const imageUrl = pickImage(p.category, perCategoryImageIndex[p.category] || 0)
    perCategoryImageIndex[p.category] = (perCategoryImageIndex[p.category] || 0) + 1

    const product = {
      name: p.name,
      price: p.price,
      category: p.category,
      imageUrl,
      inStock: true,
      isNewArrival: NEW_ARRIVAL_NAMES.has(p.name),
    }

    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(product),
    })

    if (res.ok) {
      const saved = await res.json()
      console.log(`  ✓ [${p.category}] ${saved.name}`)
      added++
    } else {
      const txt = await res.text().catch(() => '')
      console.warn(`  ✗ ${p.name}: ${txt}`)
    }
  }

  console.log(`\nDone. ${added}/${PRODUCTS.length} products seeded.`)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})

