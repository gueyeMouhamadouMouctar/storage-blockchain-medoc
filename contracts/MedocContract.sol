// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MedocContract {

  struct History {
    Structure _structure ;
    string _date ;
  }
  
  // struct Medicament {
  //   string _libelle;
  //   uint _lotId;
  //   string _datePeremption;
  //   string _ipfsHash;
  //   string _pna;
  //   string _pra;
  //   string _hopital;
  //   string _district;
  //   string _postesante;
  //   string _centresante;
  // }
  struct Medicament {
    string _libelle;
    uint _lotId;
    string _datePeremption;
    string _ipfsHash;
    History [] _history ;
  }

  mapping (string => Medicament) ListeMedicament ;

  enum typeStructure { pna, pra, hopital, district, postesante, centresante, casesante }

  struct Structure {
    string _structureName;
    MedocContract.typeStructure _structureType;
  }
  mapping (address => Structure) ListeStructure ;
  address owner;

  constructor()  {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
  }


  function addPna(address _pnaAddress, string memory _pnaName) external onlyOwner {
    require(bytes(ListeStructure[_pnaAddress]._structureName).length == 0, "Ce PNA existe deja !");
    
    Structure memory s = Structure(_pnaName, typeStructure.pna) ;
    ListeStructure[_pnaAddress] = s ;
  }
  
  function addPra(address _praAddress, string memory _praName) external onlyOwner {
    require(bytes(ListeStructure[_praAddress]._structureName).length == 0, "Ce PRA existe deja !");
    
    Structure memory s = Structure(_praName, typeStructure.pra) ;
    ListeStructure[_praAddress] = s ;
  }

  function addHopital(address _structureAddres, string memory _structureName) external onlyOwner {
    require(bytes(ListeStructure[_structureAddres]._structureName).length == 0, "Cet Hopital existe deja !");
    
    Structure memory s = Structure(_structureName, typeStructure.hopital) ;
    ListeStructure[_structureAddres] = s ;
  }

  function addDistrict(address _structureAddres, string memory _structureName) external onlyOwner {
    require(bytes(ListeStructure[_structureAddres]._structureName).length == 0, "Ce DISTRICT existe deja !");
    
    Structure memory s = Structure(_structureName, typeStructure.district) ;
    ListeStructure[_structureAddres] = s ;
  }

  function addPosteSante(address _structureAddres, string memory _structureName) external onlyOwner {
    require(bytes(ListeStructure[_structureAddres]._structureName).length == 0, "Cet Hopital existe deja !");
    
    Structure memory s = Structure(_structureName, typeStructure.postesante) ;
    ListeStructure[_structureAddres] = s ;
  }

  function addCentreSante(address _structureAddres, string memory _structureName) external onlyOwner {
    require(bytes(ListeStructure[_structureAddres]._structureName).length == 0, "Cet CENTRE SANTE existe deja !");
    
    Structure memory s = Structure(_structureName, typeStructure.centresante) ;
    ListeStructure[_structureAddres] = s ;
  }

  function addCaseSante(address _structureAddres, string memory _structureName) external onlyOwner {
    require(bytes(ListeStructure[_structureAddres]._structureName).length == 0, "Cette CASE SANTE existe deja !");
    
    Structure memory s = Structure(_structureName, typeStructure.casesante) ;
    ListeStructure[_structureAddres] = s ;
  }

  function addMedicament(string memory _libelle, uint _lotId, string memory _datePeremption, string memory _ipfsHash, string memory _date) external onlyOwner {
    require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length == 0, "Ce medicament existe deja !");
    
    ListeMedicament[_ipfsHash]._libelle = _libelle ;
    ListeMedicament[_ipfsHash]._lotId = _lotId ;
    ListeMedicament[_ipfsHash]._datePeremption = _datePeremption ;
    ListeMedicament[_ipfsHash]._ipfsHash = _ipfsHash ;

    Structure memory s = Structure(ListeStructure[msg.sender]._structureName, ListeStructure[msg.sender]._structureType) ;
    History memory h = History(s, _date) ;
    ListeMedicament[_ipfsHash]._history.push(h) ;
  }  

  function addMedicamentOnPraStock(string memory _ipfsHash, string memory _date) external{
    require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
    require(ListeStructure[msg.sender]._structureType == typeStructure.pra, "Not a PRA");
    // Verifier si le medicament vient de la PNA
    require(ListeMedicament[_ipfsHash]._history[ListeMedicament[_ipfsHash]._history.length - 1]._structure._structureType == typeStructure.pna, "Ce medicament ne provient pas de la PNA");
   
    //  Ajouter La PRA dans l'historique du médicament
    Structure memory s = Structure(ListeStructure[msg.sender]._structureName, ListeStructure[msg.sender]._structureType);
    History memory h = History(s, _date);
    ListeMedicament[_ipfsHash]._history.push(h);
  }
  
  function addMedicamentOnHopitalStock(string memory _ipfsHash, string memory _date) external{
    require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
    require(ListeStructure[msg.sender]._structureType == typeStructure.hopital, "Not a Hopital");
    // Verifier si le medicament vient de la PNA
    require(ListeMedicament[_ipfsHash]._history[ListeMedicament[_ipfsHash]._history.length - 1]._structure._structureType == typeStructure.pra, "Ce medicament ne provient pas de la PRA");
   
    //  Ajouter La PRA dans l'historique du médicament
    Structure memory s = Structure(ListeStructure[msg.sender]._structureName, ListeStructure[msg.sender]._structureType);
    History memory h = History(s, _date);
    ListeMedicament[_ipfsHash]._history.push(h);
  }

  function addMedicamentOnDistrictStock(string memory _ipfsHash, string memory _date) external{
    require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
    require(ListeStructure[msg.sender]._structureType == typeStructure.district, "Not a Ditrict");
    // Verifier si le medicament vient de la PNA
    require(ListeMedicament[_ipfsHash]._history[ListeMedicament[_ipfsHash]._history.length - 1]._structure._structureType == typeStructure.pra, "Ce medicament ne provient pas de la PRA");
   
    //  Ajouter La PRA dans l'historique du médicament
    Structure memory s = Structure(ListeStructure[msg.sender]._structureName, ListeStructure[msg.sender]._structureType);
    History memory h = History(s, _date);
    ListeMedicament[_ipfsHash]._history.push(h);
  }

  function addMedicamentOnPosteSanteStock(string memory _ipfsHash, string memory _date) external{
    require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
    require(ListeStructure[msg.sender]._structureType == typeStructure.postesante, "Not a POSTE de Sante");
    // Verifier si le medicament vient de la PNA
    require(ListeMedicament[_ipfsHash]._history[ListeMedicament[_ipfsHash]._history.length - 1]._structure._structureType == typeStructure.district, "Ce medicament ne provient pas du DISTRICT");
   
    //  Ajouter La PRA dans l'historique du médicament
    Structure memory s = Structure(ListeStructure[msg.sender]._structureName, ListeStructure[msg.sender]._structureType);
    History memory h = History(s, _date);
    ListeMedicament[_ipfsHash]._history.push(h);
  }

  function addMedicamentOnCentreSanteStock(string memory _ipfsHash, string memory _date) external{
    require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
    require(ListeStructure[msg.sender]._structureType == typeStructure.centresante, "Not a CENTRE de Sante");
    // Verifier si le medicament vient de la PNA
    require(ListeMedicament[_ipfsHash]._history[ListeMedicament[_ipfsHash]._history.length - 1]._structure._structureType == typeStructure.district, "Ce medicament ne provient pas du DISTRICT");
   
    //  Ajouter La PRA dans l'historique du médicament
    Structure memory s = Structure(ListeStructure[msg.sender]._structureName, ListeStructure[msg.sender]._structureType);
    History memory h = History(s, _date);
    ListeMedicament[_ipfsHash]._history.push(h);
  }

  function addMedicamentOnCaseSanteStock(string memory _ipfsHash, string memory _date) external{
    require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
    require(ListeStructure[msg.sender]._structureType == typeStructure.casesante, "Not a CASE de Sante");
    // Verifier si le medicament vient de la PNA
    require(ListeMedicament[_ipfsHash]._history[ListeMedicament[_ipfsHash]._history.length - 1]._structure._structureType == typeStructure.postesante, "Ce medicament ne provient pas du POSTE de SANTE");
   
    //  Ajouter La PRA dans l'historique du médicament
    Structure memory s = Structure(ListeStructure[msg.sender]._structureName, ListeStructure[msg.sender]._structureType);
    History memory h = History(s, _date);
    ListeMedicament[_ipfsHash]._history.push(h);
  }
  


  // function addMedicament(string memory _libelle, uint _lotId, string memory _datePeremption, string memory _ipfsHash) external onlyOwner {
  //   require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length == 0, "Ce medicament existe deja !");
    
  //   ListeMedicament[_ipfsHash]._libelle = _libelle ;
  //   ListeMedicament[_ipfsHash]._lotId = _lotId ;
  //   ListeMedicament[_ipfsHash]._datePeremption = _datePeremption ;
  //   ListeMedicament[_ipfsHash]._ipfsHash = _ipfsHash ;
  //   ListeMedicament[_ipfsHash]._pna = ListeStructure[owner]._structureName ;
  // }

  // function addMedicamentOnPraStock(string memory _ipfsHash) external {
  //   require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
  //   require(ListeStructure[msg.sender]._structureType == typeStructure.pra, "Not a PRA");
  //   require(bytes(ListeMedicament[_ipfsHash]._pna).length > 0, "Ce medicament ne provient pas de la PNA");
  //   require(bytes(ListeMedicament[_ipfsHash]._pra).length == 0, "Ce medicament figure deja une PRA ");
    
  //   // ajouter le medicament dans le stock de la pra
  //   ListeMedicament[_ipfsHash]._pra = ListeStructure[msg.sender]._structureName ;
  // }

  // function addMedicamentOnHopitalStock(string memory _ipfsHash) external {
  //   require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
  //   require(ListeStructure[msg.sender]._structureType == typeStructure.hopital, "Not a HOPITAL");
  //   require(bytes(ListeMedicament[_ipfsHash]._pra).length > 0, "Ce medicament ne provient pas de la PRA");
  //   require(bytes(ListeMedicament[_ipfsHash]._hopital).length == 0, "Ce medicament figure deja un HOPITAL ");
    
  //   // ajouter le medicament dans le stock de la pra
  //   ListeMedicament[_ipfsHash]._hopital = ListeStructure[msg.sender]._structureName ;
  // }

  // function addMedicamentOnDistrictStock(string memory _ipfsHash) external {
  //   require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
  //   require(ListeStructure[msg.sender]._structureType == typeStructure.district, "Not a District");
  //   require(bytes(ListeMedicament[_ipfsHash]._pra).length > 0, "Ce medicament ne provient pas de la PRA");
  //   require(bytes(ListeMedicament[_ipfsHash]._district).length == 0, "Ce medicament figure deja un District ");
    
  //   // ajouter le medicament dans le stock de la pra
  //   ListeMedicament[_ipfsHash]._district = ListeStructure[msg.sender]._structureName ;
  // }

  // function addMedicamentOnPosteSanteStock(string memory _ipfsHash) external {
  //   require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
  //   require(ListeStructure[msg.sender]._structureType == typeStructure.postesante, "Not a POSTE SANTE");
  //   require(bytes(ListeMedicament[_ipfsHash]._district).length > 0, "Ce medicament ne provient pas du District");
  //   require(bytes(ListeMedicament[_ipfsHash]._postesante).length == 0, "Ce medicament figure deja un POSTE SANTE ");
    
  //   // ajouter le medicament dans le stock de la pra
  //   ListeMedicament[_ipfsHash]._postesante = ListeStructure[msg.sender]._structureName ;
  // }

  // function addMedicamentOnCentreSanteStock(string memory _ipfsHash) external {
  //   require(bytes(ListeMedicament[_ipfsHash]._ipfsHash).length > 0, "Ce medicament ne figure sur la blockchain");
  //   require(ListeStructure[msg.sender]._structureType == typeStructure.centresante, "Not a CENTRE SANTE");
  //   require(bytes(ListeMedicament[_ipfsHash]._district).length > 0, "Ce medicament ne provient pas du District");
  //   require(bytes(ListeMedicament[_ipfsHash]._centresante).length == 0, "Ce medicament figure deja un CENTRE SANTE ");
    
  //   // ajouter le medicament dans le stock de la pra
  //   ListeMedicament[_ipfsHash]._centresante = ListeStructure[msg.sender]._structureName ;
  // }
  
  
  


  function getHistoryMedicament(string memory _ipfsHash) public view returns (Medicament memory) {
    return ListeMedicament[_ipfsHash] ;
  }

  function getStructure(address _structureAddress) public view returns (Structure memory) {
    return ListeStructure[_structureAddress] ;
  }
  
}
