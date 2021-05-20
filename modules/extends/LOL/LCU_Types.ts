export interface current_summoner {
    accountId: number,
    displayName: string,
    internalName: string,
    nameChangeFlag: boolean,
    percentCompleteForNextLevel: number,
    profileIconId: number,
    puuid: string,
    rerollPoints: {
        currentPoints: number,
        maxRolls: number,
        numberOfRolls: number,
        pointsCostToRoll: number,
        pointsToReroll: number
    },
    summonerId: number,
    summonerLevel: number,
    unnamed: boolean,
    xpSinceLastLevel: number,
    xpUntilNextLevel: number
}

export interface perk {
    autoModifiedSelections: [], 
    current: boolean,
    id: number,
    isActive: false,
    isDeletable: boolean,
    isEditable: boolean,
    isValid: boolean,
    lastModified: number,
    name: string,
    order: number,
    primaryStyleId: number,       
    selectedPerkIds: Array<number>,
    subStyleId: number
}

export interface API_perk {
    id: number,
    key: string,
    icon: string,
    name: string,
    slots: Array<{
        runes: Array<{
            id: number,
            key: string,
            icon: string,
            name: string,
            shortDesc: string,
            longDesc: string    
        }>
    }>
}



export interface Champion_DB {
    name?: string,
    position?: Array<Champion_position_DB>
}

export interface Champion_position_DB {
    type?: "Top" | "Bottom" | "Middle" | "Jungle" | "Support" | string,
    perk: Array<number>,
    primaryKeyStone: number,
    subKeyStone: number,
}

export interface Precision {
    [index: string]: any
    keystone?: "Press the Attack" | "Lethal Tempo" | "Fleet Footwork" | "Conqueror" | string,
    slot1?:  "Overheal" | "Triumph" | "Presence of Mind" | string,
    slot2?: "Legend: Alacrity" | "Legend: Tenacity" | "Legend: Bloodline" | string,
    slot3?: "Coup de Grace" | "Cut Down" | "Last Stand" | string
}
export interface Domination {
    [index: string]: any
    keystone?: "Electrocute" | "Predator" | "Dark Harvest" | "Hail of Blades" | string,
    slot1?:  "Cheap Shot" | "Taste of Blood" | "Sudden Impact" | string,
    slot2?: "Zombie Ward" | "Ghost Poro" | "Eyeball Collection" | string,
    slot3?: "Ravenous Hunter" | "Ingenious Hunter" | "Relentless Hunter" | string | "Ultimate Hunter"
}
export interface Sorcery {
    [index: string]: any
    keystone?: "Summon Aery" | "Arcane Comet" | "Phase Rush" | string,
    slot1?:  "Nullifying Orb" | "Manaflow Band" | "Nimbus Cloak" | string,
    slot2?: "Transcendence" | "Celerity" | "Absolute Focus" | string,
    slot3?: "Scorch" | "Waterwalking" | "Gathering Storm" | string
}
export interface Resolve {
    [index: string]: any
    keystone?: "Grasp of the Undying" | "Aftershock" | "Guardian" | string,
    slot1?:  "Demolish" | "Font of Life" | "Shield Bash" | string,
    slot2?: "Conditioning" | "Second Wind" | "Bone Plating" | string,
    slot3?: "Overgrowth" | "Revitalize" | "Unflinching" | string
}
export interface Inspiration {
    [index: string]: any
    keystone?: "Glacial Augment" | "Unsealed Spellbook" | "Prototype: Omnistone" | string,
    slot1?:  "Hextech Flashtraption" | "Magical Footwear" | "Perfect Timing" | string,
    slot2?: "Future's Market" | "Minion Dematerializer" | "Biscuit Delivery" | string,
    slot3?: "Cosmic Insight" | "Approach Velocity" | "Time Warp Tonic" | string
}

export interface RuneList_DB {
    [index: string]: any
    id: number,
    displayname: string
}