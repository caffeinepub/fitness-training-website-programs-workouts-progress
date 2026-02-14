import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Integrate authorization via Mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Status = { #pending };

  // Application form data
  public type ApplicationForm = {
    // Main applicant data
    fullName : Text;
    address : Text;
    nationality : Nat8;
    placeOfBirth : Text;
    dateOfBirth : Text;
    maritalStatus : ?Text;
    gender : Nat8;
    email : Text;
    phoneNumber : Text;
    idNumber : Text;
    profession : Text;
    professionAddress : Text;
    professionPhone : Text;

    // Residence info
    startOfResidency : Text;
    currentAddress : Text;
    propertyOwner : Text;
    relationToLandlord : Text;
    isHomeowner : Bool;
    isContractRenewal : Bool;
    previousResidenceCertNumber : ?Text;
    previousApplications : Nat8;
    hasVehicle : Bool;
  };

  public type Application = ApplicationForm and {
    principal : Principal;
    status : Status;
    created : Time.Time;
    lastUpdated : Time.Time;
    applicationNumber : Nat32;
  };

  module Application {
    public func compare(a : Application, b : Application) : Order.Order {
      Nat32.compare(
        a.applicationNumber,
        b.applicationNumber,
      );
    };
  };

  // Persistent state (maps for efficient queries)
  var nextId = 1;
  let applications = Map.empty<Nat32, Application>();

  // Public interface
  public shared ({ caller }) func createApplication(application : ApplicationForm) : async Nat32 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit applications");
    };

    let applicationNumber = Nat32.fromNat(nextId);
    nextId += 1;

    let newApplication : Application = {
      application with
      principal = caller;
      status = #pending;
      created = Time.now();
      lastUpdated = Time.now();
      applicationNumber;
    };

    applications.add(applicationNumber, newApplication);
    applicationNumber;
  };

  public query ({ caller }) func getOwnApplications() : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit applications");
    };
    applications.values().toArray().filter(
      func(app) { app.principal == caller }
    );
  };

  public query ({ caller }) func getAllApplications() : async [Application] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all applications");
    };
    applications.values().toArray().sort();
  };

  public query ({ caller }) func getApplicationById(applicationNumber : Nat32) : async Application {
    switch (applications.get(applicationNumber)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) {
        // Users can only view their own applications, admins can view any
        if (caller != application.principal and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own applications");
        };
        application;
      };
    };
  };
};
