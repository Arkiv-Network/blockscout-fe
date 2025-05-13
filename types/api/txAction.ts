export interface TxActionGeneral {
  type: 'mint' | 'burn' | 'collect' | 'swap';
  data: {
    amount0: string;
    symbol0: string;
    address0: string;
    amount1: string;
    symbol1: string;
    address1: string;
  };
}

export interface TxActionNft {
  type: 'mint_nft';
  data: {
    name: string;
    symbol: string;
    address: string;
    to: string;
    ids: Array<string>;
  };
}

export type TxGolemBaseAction = {
  type: 'golembase_entity_created' | 'golembase_entity_updated';
  data: {
    entity_id: string;
    expiration_block: number;
  };
} | {
  type: 'golembase_entity_deleted';
  data: {
    entity_id: string,
  };
} | {
  type: 'golembase_entity_ttl_extended';
  data: {
    entity_id: string,
    old_expiration_block: number,
    new_expiration_block: number,
  }
}

export type TxActionUniswap = {
  protocol: 'uniswap_v3';
} & (TxActionGeneral | TxActionNft);

export type TxActionGolemBase = {
  protocol: 'golembase';
} & TxGolemBaseAction;

export type TxAction = TxActionUniswap | TxActionGolemBase;