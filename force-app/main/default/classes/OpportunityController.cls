public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity(){
      return [
        SELECT Id, Name
        FROM Opportunity
        WITH SECURITY_ENFORCED
        LIMIT 10
      ];
    }
  }
